"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import Link from "next/link";
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

export default function Lessons() {
  const searchParams = useSearchParams();
  const [lessonClass, setLessonClass] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  
  const [theoryContent, setTheoryContent] = useState("");
  const [practiceContent, setPracticeContent] = useState("");
  const [theoryResources, setTheoryResources] = useState<Resource[]>([]);
  const [practiceResources, setPracticeResources] = useState<Resource[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  
  const [newTheoryResource, setNewTheoryResource] = useState<Resource>({ title: "" });
  const [newPracticeResource, setNewPracticeResource] = useState<Resource>({ title: "" });
  const [newTask, setNewTask] = useState("");

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
    const loadLessonData = async () => {
      const classParam = searchParams.get("class");
      const subjectParam = searchParams.get("subject");
      const topicParam = searchParams.get("topic");

      if (classParam) setLessonClass(classParam);
      if (subjectParam) setSubject(subjectParam);
      if (topicParam) setTopic(topicParam);

      if (!subjectParam || !topicParam) {
        setError('Не указан предмет или тема');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/materials/${subjectParam}/${topicParam}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLessonData(data);
          
          setTheoryContent(data.theory.content);
          setPracticeContent(data.practice.content);
          setTheoryResources([...data.theory.additional]);
          setPracticeResources([...data.practice.additional]);
          setTasks([...data.practice.tasks]);
        } else if (response.status === 404) {
          setLessonData(null);
          setError('');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Ошибка при загрузке материалов');
        }
      } catch (error) {
        console.error('Ошибка при загрузке материалов:', error);
        setError(error instanceof Error ? error.message : 'Ошибка при загрузке материалов');
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [searchParams]);

  const handleAddTheoryResource = () => {
    if (newTheoryResource.title.trim()) {
      setTheoryResources([...theoryResources, { ...newTheoryResource }]);
      setNewTheoryResource({ title: "" });
    }
  };

  const handleAddPracticeResource = () => {
    if (newPracticeResource.title.trim()) {
      setPracticeResources([...practiceResources, { ...newPracticeResource }]);
      setNewPracticeResource({ title: "" });
    }
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const handleDeleteTheoryResource = (index: number) => {
    setTheoryResources(theoryResources.filter((_, i) => i !== index));
  };

  const handleDeletePracticeResource = (index: number) => {
    setPracticeResources(practiceResources.filter((_, i) => i !== index));
  };

  const handleDeleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    if (!subject || !topic) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходима авторизация');
        return;
      }

      const updatedLessonData: LessonData = {
        theory: {
          type: "text",
          content: theoryContent,
          additional: theoryResources
        },
        practice: {
          type: "tasks",
          content: practiceContent,
          tasks: tasks,
          additional: practiceResources
        }
      };

      const response = await fetch(`http://localhost:8000/materials/${subject}/${topic}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLessonData),
      });

      if (response.ok) {
        setLessonData(updatedLessonData);
        setEditMode(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при сохранении изменений');
      }
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error);
      setError(error instanceof Error ? error.message : 'Ошибка при сохранении изменений');
    }
  };

  const handleCancelEdit = () => {
    if (lessonData) {
      setTheoryContent(lessonData.theory.content);
      setPracticeContent(lessonData.practice.content);
      setTheoryResources([...lessonData.theory.additional]);
      setPracticeResources([...lessonData.practice.additional]);
      setTasks([...lessonData.practice.tasks]);
    }
    setEditMode(false);
  };

  const renderEditForm = () => {
    return (
      <div className={styles.editForm}>
        <section className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>1. Теоретическая часть</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="theoryContent">Текст теоретического материала:</label>
            <textarea 
              id="theoryContent"
              className={styles.textArea}
              value={theoryContent}
              onChange={(e) => setTheoryContent(e.target.value)}
              rows={8}
              placeholder="Введите теоретический материал..."
            />
          </div>
          
          <div className={styles.resourcesSection}>
            <h4>Дополнительные материалы:</h4>
            
            <ul className={styles.resourcesList}>
              {theoryResources.map((resource, index) => (
                <li key={index} className={styles.resourceItem}>
                  <div className={styles.resourceInfo}>
                    <span className={styles.resourceTitle}>{resource.title}</span>
                    {resource.url && <span className={styles.resourceUrl}>{resource.url}</span>}
                  </div>
                  <button
                    type="button"
                    className={styles.deleteResourceBtn}
                    onClick={() => handleDeleteTheoryResource(index)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            
            <div className={styles.addResourceForm}>
              <input
                type="text"
                placeholder="Название материала"
                value={newTheoryResource.title}
                onChange={(e) => setNewTheoryResource({ ...newTheoryResource, title: e.target.value })}
                className={styles.resourceInput}
              />
              <input
                type="text"
                placeholder="URL (необязательно)"
                value={newTheoryResource.url || ""}
                onChange={(e) => setNewTheoryResource({ ...newTheoryResource, url: e.target.value })}
                className={styles.resourceInput}
              />
              <button
                type="button"
                className={styles.addResourceBtn}
                onClick={handleAddTheoryResource}
              >
                Добавить
              </button>
            </div>
          </div>
        </section>
        
        <section className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>2. Практическая часть</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="practiceContent">Описание практического задания:</label>
            <textarea 
              id="practiceContent"
              className={styles.textArea}
              value={practiceContent}
              onChange={(e) => setPracticeContent(e.target.value)}
              rows={4}
              placeholder="Введите описание практического задания..."
            />
          </div>
          
          <div className={styles.tasksSection}>
            <h4>Задания:</h4>
            
            <ul className={styles.taskEditList}>
              {tasks.map((task, index) => (
                <li key={index} className={styles.taskEditItem}>
                  <div className={styles.taskContent}>{task}</div>
                  <button
                    type="button"
                    className={styles.deleteTaskBtn}
                    onClick={() => handleDeleteTask(index)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            
            <div className={styles.addTaskForm}>
              <input
                type="text"
                placeholder="Новое задание"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className={styles.taskInput}
              />
              <button
                type="button"
                className={styles.addTaskBtn}
                onClick={handleAddTask}
              >
                Добавить
              </button>
            </div>
          </div>
          
          <div className={styles.resourcesSection}>
            <h4>Дополнительные материалы для практики:</h4>
            
            <ul className={styles.resourcesList}>
              {practiceResources.map((resource, index) => (
                <li key={index} className={styles.resourceItem}>
                  <div className={styles.resourceInfo}>
                    <span className={styles.resourceTitle}>{resource.title}</span>
                    {resource.url && <span className={styles.resourceUrl}>{resource.url}</span>}
                  </div>
                  <button
                    type="button"
                    className={styles.deleteResourceBtn}
                    onClick={() => handleDeletePracticeResource(index)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            
            <div className={styles.addResourceForm}>
              <input
                type="text"
                placeholder="Название материала"
                value={newPracticeResource.title}
                onChange={(e) => setNewPracticeResource({ ...newPracticeResource, title: e.target.value })}
                className={styles.resourceInput}
              />
              <input
                type="text"
                placeholder="URL (необязательно)"
                value={newPracticeResource.url || ""}
                onChange={(e) => setNewPracticeResource({ ...newPracticeResource, url: e.target.value })}
                className={styles.resourceInput}
              />
              <button
                type="button"
                className={styles.addResourceBtn}
                onClick={handleAddPracticeResource}
              >
                Добавить
              </button>
            </div>
          </div>
        </section>
        
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSaveChanges}
          >
            Сохранить изменения
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleCancelEdit}
          >
            Отменить
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className={styles.lessonContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>Загрузка материалов урока...</p>
            </div>
          ) : (
            <>
              <div className={styles.lessonHeader}>
                <div className={styles.headerTop}>
                  <Link href="/materials" className={styles.backLink}>
                    ← Вернуться к темам
                  </Link>
                  {!editMode && isAuthenticated && (
                    <button 
                      className={styles.editBtn}
                      onClick={toggleEditMode}
                    >
                      {lessonData ? "Редактировать" : "Создать материал"}
                    </button>
                  )}
                </div>
                <div className={styles.lessonInfo}>
                  <p className={styles.classSubject}>
                    {lessonClass} класс - {subject}
                  </p>
                  <h1 className={styles.topicTitle}>{topic}</h1>
                </div>
              </div>

              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}

              {editMode ? (
                isAuthenticated ? (
                  renderEditForm()
                ) : (
                  <div className={styles.error}>
                    Необходима авторизация для редактирования материалов
                  </div>
                )
              ) : lessonData ? (
                <div className={styles.lessonContent}>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                      <span className={styles.sectionNumber}>1</span>
                      Изучение материала
                    </h2>
                    <div className={styles.theoryCard}>
                      {lessonData.theory.type === "text" && (
                        <div className={styles.theoryText}>
                          <p>{lessonData.theory.content}</p>
                        </div>
                      )}

                      {lessonData.theory.additional && lessonData.theory.additional.length > 0 && (
                        <div className={styles.additionalResources}>
                          <h3>Дополнительные материалы:</h3>
                          <ul>
                            {lessonData.theory.additional.map((resource: Resource, index: number) => (
                              <li key={index}>
                                {resource.url ? (
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    {resource.title}
                                  </a>
                                ) : (
                                  resource.title
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>

                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                      <span className={styles.sectionNumber}>2</span>
                      Задания для закрепления
                    </h2>
                    <div className={styles.practiceCard}>
                      <p>{lessonData.practice.content}</p>

                      {lessonData.practice.tasks && lessonData.practice.tasks.length > 0 && (
                        <div className={styles.tasksList}>
                          <ol>
                            {lessonData.practice.tasks.map((task: string, index: number) => (
                              <li key={index} className={styles.taskItem}>{task}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {lessonData.practice.additional && lessonData.practice.additional.length > 0 && (
                        <div className={styles.additionalResources}>
                          <h3>Дополнительные задания:</h3>
                          <ul>
                            {lessonData.practice.additional.map((resource: Resource, index: number) => (
                              <li key={index}>
                                {resource.url ? (
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    {resource.title}
                                  </a>
                                ) : (
                                  resource.title
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              ) : (
                <div className={styles.noDataContainer}>
                  <h2>Материалы не найдены</h2>
                  <p>Для выбранной темы пока не добавлены учебные материалы.</p>
                  {isAuthenticated && (
                    <button 
                      className={styles.createMaterialBtn}
                      onClick={toggleEditMode}
                    >
                      Создать материал
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

