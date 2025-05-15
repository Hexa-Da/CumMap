import { useState, useEffect } from 'react';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { database } from '../firebase';
import { PlanningFile } from '../types';
import { auth } from '../firebase';

export default function PlanningFiles() {
  const [files, setFiles] = useState<PlanningFile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFile, setNewFile] = useState({
    name: '',
    type: 'pdf' as 'pdf' | 'excel',
    url: '',
    description: ''
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const adminsRef = ref(database, 'admins');
        onValue(adminsRef, (snapshot) => {
          const admins = snapshot.val();
          setIsAdmin(admins && admins[user.uid]);
        });
      } else {
        setIsAdmin(false);
      }
    });

    // Charger les fichiers
    const filesRef = ref(database, 'planningFiles');
    const filesUnsubscribe = onValue(filesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filesArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<PlanningFile, 'id'>)
        }));
        setFiles(filesArray);
      } else {
        setFiles([]);
      }
    });

    return () => {
      unsubscribe();
      filesUnsubscribe();
    };
  }, []);

  const handleDeleteFile = async (fileId: string) => {
    if (!isAdmin) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        await remove(ref(database, `planningFiles/${fileId}`));
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
        alert('Une erreur est survenue lors de la suppression du fichier.');
      }
    }
  };

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Vous devez être connecté pour ajouter un fichier.');
        return;
      }

      const newFileRef = push(ref(database, 'planningFiles'));
      await set(newFileRef, {
        ...newFile,
        uploadDate: Date.now(),
        uploadedBy: user.uid
      });

      // Réinitialiser le formulaire
      setNewFile({
        name: '',
        type: 'pdf',
        url: '',
        description: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du fichier:', error);
      alert('Une erreur est survenue lors de l\'ajout du fichier.');
    }
  };

  return (
    <div className="planning-files">
      <h2>Fichiers de planning</h2>
      
      {isAdmin && (
        <div className="admin-controls">
          <button
            className="add-file-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Annuler' : 'Ajouter un fichier'}
          </button>
        </div>
      )}

      {showAddForm && isAdmin && (
        <form onSubmit={handleAddFile} className="add-file-form">
          <div className="form-group">
            <label htmlFor="fileName">Nom du fichier</label>
            <input
              type="text"
              id="fileName"
              value={newFile.name}
              onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fileType">Type de fichier</label>
            <select
              id="fileType"
              value={newFile.type}
              onChange={(e) => setNewFile({ ...newFile, type: e.target.value as 'pdf' | 'excel' })}
              required
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fileUrl">URL du fichier</label>
            <input
              type="url"
              id="fileUrl"
              value={newFile.url}
              onChange={(e) => setNewFile({ ...newFile, url: e.target.value })}
              required
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="fileDescription">Description (optionnelle)</label>
            <textarea
              id="fileDescription"
              value={newFile.description}
              onChange={(e) => setNewFile({ ...newFile, description: e.target.value })}
              placeholder="Description du fichier..."
            />
          </div>

          <button type="submit" className="submit-button">
            Ajouter le fichier
          </button>
        </form>
      )}

      {files.length === 0 ? (
        <p>Aucun fichier disponible</p>
      ) : (
        <div className="files-list">
          {files.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-info">
                <h3>{file.name}</h3>
                <p>Type: {file.type.toUpperCase()}</p>
                {file.description && <p>{file.description}</p>}
                <p>Ajouté le: {new Date(file.uploadDate).toLocaleDateString()}</p>
              </div>
              <div className="file-actions">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="icon-button download-button"
                  title="Télécharger le fichier"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </a>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="icon-button delete-button"
                    title="Supprimer le fichier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 