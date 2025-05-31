"use client";

import Navbar from "../../navbar/Navbar";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

type Resource = {
  title: string;
  url?: string;
};

type TheoryContent = {
  type: string;
  content: string;
  additional: Resource[];
};

type PracticeContent = {
  type: string;
  content: string;
  tasks: string[];
  additional: Resource[];
};

type LessonData = {
  theory: TheoryContent;
  practice: PracticeContent;
};

type SubjectTopics = {
  [topic: string]: LessonData;
};

type LessonMaterialsType = {
  [subject: string]: SubjectTopics;
};

const subjects = ["Математика", "Информатика", "Физика"];

export default function Materials() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [showTopics, setShowTopics] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [topicsData, setTopicsData] = useState<LessonMaterialsType>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`http://localhost:8000/check-token?token=${token}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          setIsAuthenticated(data.valid);
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/materials', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Ошибка при загрузке материалов');
        }

        const data = await response.json();
        setTopicsData(data);
      } catch (error) {
        console.error('Ошибка при загрузке материалов:', error);
        setError(error instanceof Error ? error.message : 'Ошибка при загрузке материалов');
      } finally {
        setLoading(false);
      }
    };
    loadMaterials();
  }, []);

  const handleShowTopics = () => {
    if (selectedClass && selectedSubject) {
      setTopics(Object.keys(topicsData[selectedSubject] || {}));
      setShowTopics(true);
    } else {
      setShowTopics(false);
    }
  };

  const handleAddTopic = async () => {
    if (newTopic && selectedClass && selectedSubject) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Необходима авторизация');
          return;
        }

        const newLessonData: LessonData = {
          theory: {
            type: "text",
            content: "Новый материал",
            additional: []
          },
          practice: {
            type: "tasks",
            content: "Задания для закрепления",
            tasks: [],
            additional: []
          }
        };

        const response = await fetch(`http://localhost:8000/materials/${selectedSubject}/${newTopic}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLessonData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Ошибка при создании темы');
        }

        setTopics([...topics, newTopic]);
        setNewTopic("");
        const materialsResponse = await fetch('http://localhost:8000/materials', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (materialsResponse.ok) {
          const data = await materialsResponse.json();
          setTopicsData(data);
        }
      } catch (error) {
        console.error('Ошибка при создании темы:', error);
        setError(error instanceof Error ? error.message : 'Ошибка при создании темы');
      }
    }
  };

  const handleDeleteTopic = async (topicToDelete: string) => {
    if (!confirm(`Вы уверены, что хотите удалить тему "${topicToDelete}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходима авторизация');
        return;
      }

      const response = await fetch(`http://localhost:8000/materials/${selectedSubject}/${topicToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при удалении темы');
      }

      setTopics(topics.filter(topic => topic !== topicToDelete));
      const materialsResponse = await fetch('http://localhost:8000/materials', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (materialsResponse.ok) {
        const data = await materialsResponse.json();
        setTopicsData(data);
      }
    } catch (error) {
      console.error('Ошибка при удалении темы:', error);
      setError(error instanceof Error ? error.message : 'Ошибка при удалении темы');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTopic) {
      handleAddTopic();
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className={styles.materialsContainer}>
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>Загрузка материалов...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className={styles.materialsContainer}>
          <h1 className={styles.pageTitle}>Учебные материалы</h1>
          <p className={styles.pageDescription}>
            Выберите класс и предмет для просмотра доступных тем для изучения
          </p>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.formContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="classSelect">Класс:</label>
              <select
                id="classSelect"
                className={styles.select}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Выберите класс</option>
                <option value="7">7 класс</option>
                <option value="8">8 класс</option>
                <option value="9">9 класс</option>
                <option value="10">10 класс</option>
                <option value="11">11 класс</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subjectSelect">Предмет:</label>
              <select
                id="subjectSelect"
                className={styles.select}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Выберите предмет</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className={styles.showTopicsBtn}
              onClick={handleShowTopics}
              disabled={!selectedClass || !selectedSubject}
            >
              Показать темы
            </button>
          </div>
          
          {showTopics && (
            <>
              {isAuthenticated && (
                <div className={styles.addTopicContainer}>
                  <h3 className={styles.addTopicTitle}>Добавить новую тему</h3>
                  <div className={styles.addTopicForm}>
                    <input
                      type="text"
                      className={styles.topicInput}
                      placeholder="Введите название новой темы"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      className={`${styles.addTopicBtn} ${!newTopic ? styles.addTopicBtnDisabled : ''}`}
                      onClick={handleAddTopic}
                      disabled={!newTopic}
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              )}
              
              <div className={styles.topicsContainer}>
                <h2 className={styles.topicsTitle}>
                  Темы по предмету &quot;{selectedSubject}&quot; для {selectedClass} класса
                </h2>
                
                {topics.length > 0 ? (
                  <ul className={styles.topicsList}>
                    {topics.map((topic) => (
                      <li key={topic} className={styles.topicItem}>
                        <div className={styles.topicCard}>
                          {isAuthenticated && (
                            <button
                              onClick={() => handleDeleteTopic(topic)}
                              className={styles.deleteBtn}
                              title="Удалить тему"
                            >
                              ✕
                            </button>
                          )}
                          <h3 className={styles.topicTitle}>{topic}</h3>
                          <a href={`/lessons?class=${selectedClass}&subject=${encodeURIComponent(selectedSubject)}&topic=${encodeURIComponent(topic)}`} className={styles.topicLink}>
                            Перейти к материалам
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noTopicsMessage}>
                    Темы для данного класса и предмета не найдены
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}