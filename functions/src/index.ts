import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import type { Request } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getDatabase } from "firebase-admin/database";

const app = initializeApp();
const messaging = getMessaging(app);
const database = getDatabase(app);

// Définir le secret pour Firebase Functions v2
const functionSecret = defineSecret("FUNCTION_SECRET");

function assertAuthorized(req: Request, secret: string) {
  if (!secret) {
    throw new Error("FUNCTION_SECRET non configuré côté serveur");
  }
  
  const auth = req.headers.authorization;
  if (!auth) {
    throw new Error("Header Authorization manquant");
  }
  
  if (!auth.startsWith("Bearer ")) {
    throw new Error("Format Authorization invalide (attendu: Bearer <token>)");
  }
  
  const token = auth.substring(7);
  if (token !== secret) {
    throw new Error("Token d'authentification invalide");
  }
}

export const subscribeToTopic = onRequest(
  {
    region: 'europe-west1', // Région cohérente avec les autres fonctions
    cors: true, // Activer CORS pour les appels depuis le web
    secrets: [functionSecret], // Déclarer le secret utilisé
  },
  async (req, res) => {
    try {
      assertAuthorized(req, functionSecret.value());
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const { token, topic } = req.body ?? {};
      if (!token || !topic) {
        res.status(400).send("token et topic sont requis");
        return;
      }

      await messaging.subscribeToTopic([token], topic);
      res.status(200).send({ success: true });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('[subscribeToTopic] Erreur:', errorMessage);
      res.status(500).send({ error: errorMessage });
    }
  }
);

export const sendChatNotification = onRequest(
  {
    region: 'europe-west1', // Région cohérente avec syncAllDelegationVotes
    cors: true, // Activer CORS pour les appels depuis le web
    secrets: [functionSecret], // Déclarer le secret utilisé
  },
  async (req, res) => {
    try {
      assertAuthorized(req, functionSecret.value());
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const { message, sender, topic, timestamp } = req.body ?? {};
      if (!message || !topic) {
        res.status(400).send("message et topic sont requis");
        return;
      }

      await messaging.send({
        topic,
        notification: {
          title: sender && sender.trim() ? `Nouveau message : ${sender}` : "Nouveau message",
          body: message,
        },
        android: {
          notification: {
            icon: 'ic_notification', // Nom de l'icône dans les ressources Android (sans extension)
            color: '#000000', // Couleur de l'icône
            priority: 'high' as const,
            sound: 'default',
            channelId: 'default', // Canal de notification par défaut
          },
        },
        data: {
          sender: sender ?? "",
          message,
          timestamp: String(timestamp ?? Date.now()),
        },
      });

      res.status(200).send({ success: true });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('[sendChatNotification] Erreur:', errorMessage);
      res.status(500).send({ error: errorMessage });
    }
  }
);

interface DelegationVotes {
  [sportKey: string]: {
    votes: { [delegation: string]: number };
    totalVotes: number;
    winner: string | null;
  };
}

interface Participant {
  delegation?: string;
  bets?: { [sportKey: string]: string | null };
  [key: string]: unknown;
}

export const syncAllDelegationVotes = onRequest(
  {
    region: 'europe-west1', // Région par défaut, peut être modifiée selon vos besoins
    cors: true, // Activer CORS pour les appels depuis le web
    secrets: [functionSecret], // Déclarer le secret utilisé
  },
  async (req, res) => {
    try {
      assertAuthorized(req, functionSecret.value());
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      // Récupérer tous les participants
      const participantsRef = database.ref("participants");
      const participantsSnapshot = await participantsRef.once("value");

      if (!participantsSnapshot.exists()) {
        res.status(200).send({ success: true, message: "Aucun participant trouvé" });
        return;
      }

      const allParticipants = participantsSnapshot.val() as Record<string, Participant>;
      const allDelegations = new Set<string>();
      const delegationVotesMap: { [delegation: string]: DelegationVotes } = {};

      // Première passe : identifier toutes les délégations et initialiser
      Object.values(allParticipants).forEach((participant) => {
        if (participant.delegation) {
          allDelegations.add(participant.delegation);
          if (!delegationVotesMap[participant.delegation]) {
            delegationVotesMap[participant.delegation] = {};
          }
        }
      });

      // Deuxième passe : compter les votes pour chaque délégation
      Object.values(allParticipants).forEach((participant) => {
        if (participant.delegation && participant.bets) {
          const delegation = participant.delegation;
          const newDelegationVotes = delegationVotesMap[delegation];

          // Parcourir les paris de ce participant
          Object.entries(participant.bets).forEach(([sportKey, votedDelegation]) => {
            if (votedDelegation) {
              if (!newDelegationVotes[sportKey]) {
                newDelegationVotes[sportKey] = {
                  votes: {},
                  totalVotes: 0,
                  winner: null
                };
              }

              // Incrémenter le vote pour cette délégation
              if (!newDelegationVotes[sportKey].votes[votedDelegation as string]) {
                newDelegationVotes[sportKey].votes[votedDelegation as string] = 0;
              }
              newDelegationVotes[sportKey].votes[votedDelegation as string]++;
              newDelegationVotes[sportKey].totalVotes++;
            }
          });
        }
      });

      // Charger les winners existants depuis Firebase pour les préserver
      const existingWinnersMap: { [delegation: string]: { [sportKey: string]: string | null } } = {};
      const loadWinnersPromises = Array.from(allDelegations).map(async (delegation) => {
        const delegationBetsRef = database.ref(`delegationBets/${delegation}`);
        const snapshot = await delegationBetsRef.once("value");
        if (snapshot.exists()) {
          const votes = snapshot.val();
          existingWinnersMap[delegation] = {};
          Object.keys(votes).forEach(sportKey => {
            existingWinnersMap[delegation][sportKey] = votes[sportKey].winner || null;
          });
        }
      });
      await Promise.all(loadWinnersPromises);

      // Mettre à jour les votes tout en préservant les winners existants
      const updatePromises: Promise<void>[] = [];

      allDelegations.forEach(delegation => {
        const votes = delegationVotesMap[delegation];
        Object.keys(votes).forEach(sportKey => {
          const sportVotes = votes[sportKey];
          // Préserver le winner existant s'il existe, sinon ne pas définir de winner automatiquement
          if (existingWinnersMap[delegation] && existingWinnersMap[delegation][sportKey] !== undefined) {
            sportVotes.winner = existingWinnersMap[delegation][sportKey];
          } else {
            // Si aucun winner n'existe, ne pas en définir automatiquement
            sportVotes.winner = null;
          }
        });

        // Sauvegarder dans Firebase
        const delegationBetsRef = database.ref(`delegationBets/${delegation}`);
        const updatePromise = delegationBetsRef.set(votes).catch(err => {
          console.error(`Erreur sauvegarde votes délégation ${delegation}:`, err);
        });
        updatePromises.push(updatePromise);
      });

      // Attendre que toutes les sauvegardes soient terminées
      await Promise.all(updatePromises);

      res.status(200).send({ 
        success: true, 
        message: `Votes synchronisés pour ${allDelegations.size} délégation(s)` 
      });
    } catch (error) {
      console.error("Erreur synchronisation votes délégation:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  }
);

/**
 * Fonction générique pour envoyer des notifications depuis le site web
 * 
 * Supporte plusieurs modes d'envoi :
 * - topic: Envoie à tous les abonnés d'un topic
 * - token: Envoie à un token spécifique
 * - tokens: Envoie à plusieurs tokens (multicast, max 500)
 * - broadcast: Envoie à tous les tokens enregistrés dans la DB
 * 
 * Body attendu :
 * {
 *   title: string (requis)
 *   body: string (requis)
 *   type: 'topic' | 'token' | 'tokens' | 'broadcast' (requis)
 *   target: string | string[] (requis selon le type)
 *   data?: Record<string, string> (optionnel)
 *   imageUrl?: string (optionnel)
 * }
 */
export const sendNotification = onRequest(
  {
    region: 'europe-west1',
    cors: true,
    secrets: [functionSecret],
  },
  async (req, res) => {
    try {
      assertAuthorized(req, functionSecret.value());
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const { title, body, type, target, data, imageUrl } = req.body ?? {};

      // Validation des champs requis
      if (!title || !body || !type) {
        res.status(400).send({
          error: "title, body et type sont requis",
          example: {
            title: "Titre de la notification",
            body: "Corps du message",
            type: "topic",
            target: "chat"
          }
        });
        return;
      }

      // Construire le message de base
      const baseMessage: any = {
        notification: {
          title,
          body,
          ...(imageUrl && { imageUrl }),
        },
        android: {
          notification: {
            icon: 'ic_notification',
            color: '#000000',
            priority: 'high' as const,
            sound: 'default',
            channelId: 'default',
            ...(imageUrl && { imageUrl }),
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
        ...(data && { data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) }),
      };

      let result: any;

      switch (type) {
        case 'topic':
          if (!target || typeof target !== 'string') {
            res.status(400).send({ error: "target doit être une string pour type 'topic'" });
            return;
          }
          result = await messaging.send({
            ...baseMessage,
            topic: target,
          });
          res.status(200).send({
            success: true,
            messageId: result,
            type: 'topic',
            target,
          });
          break;

        case 'token':
          if (!target || typeof target !== 'string') {
            res.status(400).send({ error: "target doit être une string pour type 'token'" });
            return;
          }
          result = await messaging.send({
            ...baseMessage,
            token: target,
          });
          res.status(200).send({
            success: true,
            messageId: result,
            type: 'token',
            target,
          });
          break;

        case 'tokens':
          if (!Array.isArray(target) || target.length === 0) {
            res.status(400).send({ error: "target doit être un array non vide pour type 'tokens'" });
            return;
          }
          if (target.length > 500) {
            res.status(400).send({ error: "Maximum 500 tokens pour type 'tokens'" });
            return;
          }
          result = await messaging.sendEachForMulticast({
            ...baseMessage,
            tokens: target,
          });
          res.status(200).send({
            success: true,
            successCount: result.successCount,
            failureCount: result.failureCount,
            responses: result.responses.map((r: { success: boolean; error?: { message: string } }, i: number) => ({
              token: target[i],
              success: r.success,
              error: r.error?.message,
            })),
            type: 'tokens',
            targetCount: target.length,
          });
          break;

        case 'broadcast':
          // Récupérer tous les tokens depuis la DB
          const tokensRef = database.ref("fcmTokens");
          const tokensSnapshot = await tokensRef.once("value");

          if (!tokensSnapshot.exists()) {
            res.status(200).send({
              success: true,
              message: "Aucun token trouvé dans la base de données",
              successCount: 0,
              failureCount: 0,
            });
            return;
          }

          const tokensData = tokensSnapshot.val() as Record<string, { token: string; platform?: string; updatedAt?: number }>;
          const allTokens = Object.values(tokensData)
            .map((item) => item.token)
            .filter((token): token is string => Boolean(token));

          if (allTokens.length === 0) {
            res.status(200).send({
              success: true,
              message: "Aucun token valide trouvé",
              successCount: 0,
              failureCount: 0,
            });
            return;
          }

          // Envoyer par batch de 500 (limite FCM)
          const batchSize = 500;
          const batches: string[][] = [];
          for (let i = 0; i < allTokens.length; i += batchSize) {
            batches.push(allTokens.slice(i, i + batchSize));
          }

          const batchResults = await Promise.all(
            batches.map((batch) =>
              messaging.sendEachForMulticast({
                ...baseMessage,
                tokens: batch,
              })
            )
          );

          const totalSuccess = batchResults.reduce((sum, r) => sum + r.successCount, 0);
          const totalFailure = batchResults.reduce((sum, r) => sum + r.failureCount, 0);

          res.status(200).send({
            success: true,
            successCount: totalSuccess,
            failureCount: totalFailure,
            totalTokens: allTokens.length,
            batches: batches.length,
            type: 'broadcast',
          });
          break;

        default:
          res.status(400).send({
            error: `Type invalide: ${type}. Types supportés: 'topic', 'token', 'tokens', 'broadcast'`,
          });
          return;
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('[sendNotification] Erreur:', errorMessage);
      res.status(500).send({ error: errorMessage });
    }
  }
);
