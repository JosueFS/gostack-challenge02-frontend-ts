import React, { useState, useEffect } from 'react';

import api from './services/api';

import './App.css';

interface Repository {
  id: string;
  title: string;
  url: string;
  techs: string[];
  likes: number;
}

// type NewRepository = Omit<Repository, 'id' | 'likes'>;

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  async function handleAddRepository(){
    const newRepo = {
      title: `New Repository #${repositories.length +1}`,
      url: 'https://github.com/Rocketseat/bootcamp-gostack-desafios',
      techs: [
        'python',
        'java',
        'php'
      ]
    };

    const response = await api.post('/repositories', newRepo);

    setRepositories([...repositories, response.data]);

    return console.log(response.data);

  }
  
  async function handleRemoveRepository(id: string){
    await api.delete(`repositories/${id}`).then(res => {
      if (res.status === 204) {
        let filteredRepos = repositories.filter(r => r.id !== id);
        setRepositories(filteredRepos);
        return;
      }

      return alert('Repository not Found! \nRefresh Page (F5)');
    });
  }

  async function handleLikeRepository(id: string){
    const response = await api.post(`repositories/${id}/like`).then(res => {
      if(res.status !== 200){
        return;
      }
      return res.data as Repository;
    });

    if (response){
      const repoIndex = repositories.findIndex(r => r.id === id);
  
      let newReposWithLike: Repository[] = [...repositories];
      newReposWithLike[repoIndex] = response;
  
      setRepositories(newReposWithLike);
    }
  }

  useEffect(() => {
    api.get('repositories').then(res => {
      setRepositories(res.data);
    })
  }, []);

  return (
    <div className="App">
      <h1 id="title">Repository List</h1>

      <ul className="repo-list">
        {repositories.map(repo => (
        <li key={repo.id}>
          <span>{repo.title}</span>
          <button onClick={() => handleLikeRepository(repo.id)}>
            <span>♥ {repo.likes}</span>
          </button>
          <button onClick={() => handleRemoveRepository(repo.id)}>Remove</button>
        </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Add Repository</button>
    </div>
  );
}

export default App;
