"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import Link from "next/link";

// Типы для учебных материалов
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

// Примеры данных с учебными материалами
const lessonMaterialsData: LessonMaterialsType = {
  "Математика": {
    "Целые числа и действия над ними": {
      theory: {
        type: "text",
        content: "Целые числа включают в себя натуральные числа (1, 2, 3, ...), ноль (0) и отрицательные числа (-1, -2, -3, ...). Основные операции над целыми числами включают сложение, вычитание, умножение и деление. При сложении и вычитании чисел с разными знаками нужно учитывать правила знаков.",
        additional: [
          {
            title: "Видео: Действия с целыми числами",
            url: "https://www.youtube.com/watch?v=example1"
          },
          {
            title: "Учебник: §1.2 Действия с целыми числами, страницы 15-18"
          }
        ]
      },
      practice: {
        type: "tasks",
        content: "Для закрепления материала решите следующие задачи:",
        tasks: [
          "Вычислите: (-5) + 8",
          "Вычислите: 12 - (-3)",
          "Найдите значение выражения: (-2) × (-7)",
          "Найдите значение выражения: (-45) ÷ (-9)"
        ],
        additional: [
          {
            title: "Интерактивный тест по теме",
            url: "https://www.mathtest.ru/test/integers"
          },
          {
            title: "Задания из учебника: №25-30, страница 20"
          }
        ]
      }
    },
    "Квадратные корни": {
      theory: {
        type: "text",
        content: "Квадратный корень из числа a - это число b, такое что b² = a. Квадратный корень обозначается символом √. Например, √25 = 5, потому что 5² = 25. Важно помнить, что извлечение квадратного корня из отрицательного числа в области действительных чисел невозможно.",
        additional: [
          {
            title: "Видеоурок: Квадратные корни и их свойства",
            url: "https://www.youtube.com/watch?v=example2"
          },
          {
            title: "Полезные формулы и свойства квадратных корней",
            url: "https://www.mathformulas.ru/square-roots"
          }
        ]
      },
      practice: {
        type: "tasks",
        content: "Для закрепления материала выполните следующие задания:",
        tasks: [
          "Вычислите: √36",
          "Упростите выражение: √8 × √2",
          "Вынесите множитель из-под знака корня: √50",
          "Сравните числа: √10 и 3"
        ],
        additional: [
          {
            title: "Тренажер по квадратным корням",
            url: "https://www.mathtrainer.ru/square-roots"
          },
          {
            title: "Задания из учебника: №112-118, страница 78"
          }
        ]
      }
    }
  },
  "Информатика": {
    "Основы алгоритмизации": {
      theory: {
        type: "text",
        content: "Алгоритм - это конечная последовательность шагов, выполнение которых позволяет решить поставленную задачу. Основные свойства алгоритма: дискретность, детерминированность, конечность, результативность, массовость. Алгоритмы можно записать на естественном языке, в виде блок-схем и на языках программирования.",
        additional: [
          {
            title: "Видеолекция: Введение в алгоритмы",
            url: "https://www.youtube.com/watch?v=example3"
          },
          {
            title: "Блок-схемы алгоритмов: обозначения и примеры",
            url: "https://www.informatics.ru/flowcharts"
          }
        ]
      },
      practice: {
        type: "tasks",
        content: "Для закрепления материала выполните следующие задания:",
        tasks: [
          "Составьте алгоритм нахождения наибольшего из трех чисел",
          "Нарисуйте блок-схему алгоритма вычисления суммы чисел от 1 до N",
          "Запишите на псевдокоде алгоритм проверки числа на простоту",
          "Составьте алгоритм сортировки массива из 5 чисел методом пузырька"
        ],
        additional: [
          {
            title: "Интерактивный тренажер по алгоритмам",
            url: "https://www.informaticslab.ru/algorithms"
          },
          {
            title: "Практикум: §3.4, задания 1-5, страница 95"
          }
        ]
      }
    },
    "Обработка текстовой информации": {
      theory: {
        type: "text",
        content: "Текстовая информация в компьютере кодируется с помощью специальных кодовых таблиц, таких как ASCII или Unicode. Для работы с текстом используются текстовые редакторы и процессоры. Основные операции обработки текста: ввод, редактирование, форматирование, поиск, замена и сохранение.",
        additional: [
          {
            title: "Видеоурок: Кодирование текстовой информации",
            url: "https://www.youtube.com/watch?v=example4"
          },
          {
            title: "Работа в текстовом процессоре MS Word",
            url: "https://www.office-lessons.ru/word-basics"
          }
        ]
      },
      practice: {
        type: "tasks",
        content: "Для закрепления материала выполните следующие задания:",
        tasks: [
          "Определите информационный объем текста из 256 символов в кодировке ASCII",
          "Создайте документ в текстовом процессоре и отформатируйте его согласно образцу",
          "Выполните поиск и замену всех вхождений слова в тексте",
          "Создайте таблицу с данными и выполните сортировку по заданному столбцу"
        ],
        additional: [
          {
            title: "Практикум по работе с текстовыми процессорами",
            url: "https://www.informaticslab.ru/text-processing"
          },
          {
            title: "Задания из учебника: §4.5, практическая работа 4.1, страница 156"
          }
        ]
      }
    }
  },
  "Физика": {
    "Механика: кинематика": {
      theory: {
        type: "text",
        content: "Кинематика — раздел механики, изучающий математическое описание движения тел без учёта причин этого движения. Основные характеристики движения: перемещение, скорость и ускорение. Виды движения: равномерное прямолинейное, равноускоренное прямолинейное, движение по окружности.",
        additional: [
          {
            title: "Видеоурок: Основы кинематики",
            url: "https://www.youtube.com/watch?v=example5"
          },
          {
            title: "Интерактивные модели движения",
            url: "https://www.physics-animations.com/kinematics"
          }
        ]
      },
      practice: {
        type: "tasks",
        content: "Для закрепления материала решите следующие задачи:",
        tasks: [
          "Автомобиль движется со скоростью 72 км/ч. Какое расстояние он проедет за 30 минут?",
          "Тело свободно падает с высоты 80 м. Через какое время оно достигнет земли?",
          "Поезд начинает тормозить с ускорением 0,5 м/с². Какой путь он пройдет до остановки, если его начальная скорость 36 км/ч?",
          "Найдите центростремительное ускорение точки, равномерно движущейся по окружности радиусом 5 м с периодом 2 с."
        ],
        additional: [
          {
            title: "Сборник задач по кинематике с решениями",
            url: "https://www.physics-problems.ru/kinematics"
          },
          {
            title: "Задачник: §1.3, задачи 15-20, страница 25"
          }
        ]
      }
    },
    "Тепловые явления": {
      theory: {
        type: "text",
        content: "Тепловые явления связаны с изменением внутренней энергии тел. Основные понятия: температура, количество теплоты, удельная теплоемкость, удельная теплота сгорания топлива, удельная теплота плавления и парообразования. Уравнение теплового баланса описывает обмен тепловой энергией в замкнутой системе.",
        additional: [
          {
            title: "Видеоурок: Тепловые явления и термодинамика",
            url: "https://www.youtube.com/watch?v=example6"
          },
          {
            title: "Учебник: §2.1-2.4, Тепловые явления, страницы 38-52"
          }
        ]
      },
      practice: {
        type: "tasks",
        content: "Для закрепления материала решите следующие задачи:",
        tasks: [
          "Какое количество теплоты требуется для нагревания алюминиевой детали массой 200 г от 20°C до 100°C?",
          "Сколько теплоты выделится при полном сгорании 5 кг каменного угля?",
          "В воду массой 500 г при температуре 20°C опустили кусок льда массой 100 г при температуре -10°C. Определите конечную температуру воды.",
          "Какое количество теплоты необходимо для превращения 2 кг воды при 100°C в пар при той же температуре?"
        ],
        additional: [
          {
            title: "Интерактивный тренажер по тепловым явлениям",
            url: "https://www.physics-trainer.ru/thermal-phenomena"
          },
          {
            title: "Задачник: §2.5, задачи 15-25, страницы 60-62"
          }
        ]
      }
    }
  }
};

export default function Lessons() {
  const searchParams = useSearchParams();
  const [lessonClass, setLessonClass] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [lessonMaterials, setLessonMaterials] = useState<LessonMaterialsType>(lessonMaterialsData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Состояние для форм редактирования
  const [theoryContent, setTheoryContent] = useState("");
  const [practiceContent, setPracticeContent] = useState("");
  const [theoryResources, setTheoryResources] = useState<Resource[]>([]);
  const [practiceResources, setPracticeResources] = useState<Resource[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  
  // Вспомогательные состояния для добавления новых элементов
  const [newTheoryResource, setNewTheoryResource] = useState<Resource>({ title: "" });
  const [newPracticeResource, setNewPracticeResource] = useState<Resource>({ title: "" });
  const [newTask, setNewTask] = useState("");

  // Проверка авторизации при загрузке страницы
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
    const classParam = searchParams.get("class");
    const subjectParam = searchParams.get("subject");
    const topicParam = searchParams.get("topic");

    if (classParam) setLessonClass(classParam);
    if (subjectParam) setSubject(subjectParam);
    if (topicParam) setTopic(topicParam);

    // Имитация загрузки данных
    setLoading(true);
    setTimeout(() => {
      if (subjectParam && topicParam && lessonMaterials[subjectParam]?.[topicParam]) {
        const currentData = lessonMaterials[subjectParam][topicParam];
        setLessonData(currentData);
        
        // Инициализация состояний формы для режима редактирования
        setTheoryContent(currentData.theory.content);
        setPracticeContent(currentData.practice.content);
        setTheoryResources([...currentData.theory.additional]);
        setPracticeResources([...currentData.practice.additional]);
        setTasks([...currentData.practice.tasks]);
      } else {
        // Инициализация пустого материала, если его нет
        setLessonData(null);
        setTheoryContent("");
        setPracticeContent("");
        setTheoryResources([]);
        setPracticeResources([]);
        setTasks([]);
      }
      setLoading(false);
    }, 500);
  }, [searchParams, lessonMaterials]);

  // Обработчики для формы редактирования
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

  // Переключение режима редактирования
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Сохранение изменений
  const handleSaveChanges = () => {
    if (!subject || !topic) return;

    // Создаем обновленный объект с данными урока
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

    // Обновляем локальное состояние
    const updatedMaterials = { ...lessonMaterials };
    
    // Создаем объекты для темы/предмета, если их нет
    if (!updatedMaterials[subject]) {
      updatedMaterials[subject] = {};
    }
    
    updatedMaterials[subject][topic] = updatedLessonData;
    setLessonMaterials(updatedMaterials);
    setLessonData(updatedLessonData);
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    // Отмена редактирования - возвращаем исходные данные
    if (lessonData) {
      setTheoryContent(lessonData.theory.content);
      setPracticeContent(lessonData.practice.content);
      setTheoryResources([...lessonData.theory.additional]);
      setPracticeResources([...lessonData.practice.additional]);
      setTasks([...lessonData.practice.tasks]);
    }
    setEditMode(false);
  };

  // Форма для редактирования материала
  const renderEditForm = () => {
    return (
      <div className="card p-4 mb-4 shadow-sm">
        {/* Редактирование теоретической части */}
        <section className="mb-4 pb-4 border-bottom">
          <h3 className="fw-bold mb-3" style={{color: "#1a237e"}}>1. Теоретическая часть</h3>
          
          <div className="mb-3">
            <label htmlFor="theoryContent" className="form-label fw-medium">Текст теоретического материала:</label>
            <textarea 
              id="theoryContent"
              className="form-control"
              value={theoryContent}
              onChange={(e) => setTheoryContent(e.target.value)}
              rows={8}
              placeholder="Введите теоретический материал..."
            />
          </div>
          
          <div className="bg-light p-3 rounded mt-4">
            <h4 className="fw-medium mb-3" style={{color: "#1a237e"}}>Дополнительные материалы:</h4>
            
            <ul className="list-group mb-3">
              {theoryResources.map((resource, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="me-auto">
                    <div className="fw-medium">{resource.title}</div>
                    {resource.url && <div className="small" style={{color: "#1a237e"}}>{resource.url}</div>}
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm rounded-circle"
                    style={{width: '30px', height: '30px', padding: '0'}}
                    onClick={() => handleDeleteTheoryResource(index)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  type="text"
                  placeholder="Название материала"
                  value={newTheoryResource.title}
                  onChange={(e) => setNewTheoryResource({ ...newTheoryResource, title: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="col-md-5">
                <input
                  type="text"
                  placeholder="URL (необязательно)"
                  value={newTheoryResource.url || ""}
                  onChange={(e) => setNewTheoryResource({ ...newTheoryResource, url: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn text-white w-100"
                  style={{backgroundColor: "#1a237e"}}
                  onClick={handleAddTheoryResource}
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Редактирование практической части */}
        <section className="mb-4">
          <h3 className="fw-bold mb-3" style={{color: "#1a237e"}}>2. Практическая часть</h3>
          
          <div className="mb-3">
            <label htmlFor="practiceContent" className="form-label fw-medium">Описание практического задания:</label>
            <textarea 
              id="practiceContent"
              className="form-control"
              value={practiceContent}
              onChange={(e) => setPracticeContent(e.target.value)}
              rows={4}
              placeholder="Введите описание практического задания..."
            />
          </div>
          
          <div className="bg-light p-3 rounded mb-4">
            <h4 className="fw-medium mb-3" style={{color: "#1a237e"}}>Задания:</h4>
            
            <ul className="list-group mb-3">
              {tasks.map((task, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="me-auto">{task}</div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm rounded-circle"
                    style={{width: '30px', height: '30px', padding: '0'}}
                    onClick={() => handleDeleteTask(index)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="row g-2">
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Новое задание"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn text-white w-100"
                  style={{backgroundColor: "#1a237e"}}
                  onClick={handleAddTask}
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-light p-3 rounded">
            <h4 className="fw-medium mb-3" style={{color: "#1a237e"}}>Дополнительные материалы для практики:</h4>
            
            <ul className="list-group mb-3">
              {practiceResources.map((resource, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="me-auto">
                    <div className="fw-medium">{resource.title}</div>
                    {resource.url && <div className="small" style={{color: "#1a237e"}}>{resource.url}</div>}
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm rounded-circle"
                    style={{width: '30px', height: '30px', padding: '0'}}
                    onClick={() => handleDeletePracticeResource(index)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  type="text"
                  placeholder="Название материала"
                  value={newPracticeResource.title}
                  onChange={(e) => setNewPracticeResource({ ...newPracticeResource, title: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="col-md-5">
                <input
                  type="text"
                  placeholder="URL (необязательно)"
                  value={newPracticeResource.url || ""}
                  onChange={(e) => setNewPracticeResource({ ...newPracticeResource, url: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn text-white w-100"
                  style={{backgroundColor: "#1a237e"}}
                  onClick={handleAddPracticeResource}
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSaveChanges}
          >
            Сохранить изменения
          </button>
          <button
            type="button"
            className="btn btn-secondary"
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
        <div className="lessonContainer">
          {loading ? (
            <div className="loadingContainer">
              <div className="loader"></div>
              <p>Загрузка материалов урока...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Link href="/materials" className="text-decoration-none fw-medium" style={{color: "#1a237e"}}>
                    ← Вернуться к темам
                  </Link>
                  {!editMode && isAuthenticated && (
                    <button 
                      className="btn text-white"
                      style={{backgroundColor: "#1a237e"}}
                      onClick={toggleEditMode}
                    >
                      {lessonData ? "Редактировать" : "Создать материал"}
                    </button>
                  )}
                </div>
                <div className="card p-4 shadow-sm">
                  <h4 className="text-secondary mb-2">
                    {lessonClass} класс - {subject}
                  </h4>
                  <h1 className="fw-bold" style={{color: "#1a237e"}}>{topic}</h1>
                </div>
              </div>

              {editMode ? (
                renderEditForm()
              ) : lessonData ? (
                // Просмотр материала
                <div className="row g-4">
                  {/* Секция 1: Теоретические материалы */}
                  <section className="col-12 mb-4">
                    <h2 className="d-flex align-items-center mb-3">
                      <span className="d-flex align-items-center justify-content-center text-white rounded-circle me-2" 
                        style={{width: '36px', height: '36px', backgroundColor: "#1a237e"}}>1</span>
                      <span className="fw-bold" style={{color: "#1a237e"}}>Изучение материала</span>
                    </h2>
                    <div className="card p-4 shadow-sm">
                      {lessonData.theory.type === "text" && (
                        <div className="mb-4">
                          <p className="fs-5 lh-lg text-dark">{lessonData.theory.content}</p>
                        </div>
                      )}

                      {lessonData.theory.additional && lessonData.theory.additional.length > 0 && (
                        <div className="bg-light p-4 rounded">
                          <h3 className="fs-5 fw-bold mb-3" style={{color: "#1a237e"}}>Дополнительные материалы:</h3>
                          <ul className="list-unstyled ps-3">
                            {lessonData.theory.additional.map((resource: Resource, index: number) => (
                              <li key={index} className="mb-2 position-relative ps-3">
                                <span className="position-absolute" style={{left: '-10px', top: '2px'}}>•</span>
                                {resource.url ? (
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-medium" style={{color: "#1a237e"}}>
                                    {resource.title} 🔗
                                  </a>
                                ) : (
                                  <span>{resource.title}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Секция 2: Практические задания */}
                  <section className="col-12">
                    <h2 className="d-flex align-items-center mb-3">
                      <span className="d-flex align-items-center justify-content-center text-white rounded-circle me-2" 
                        style={{width: '36px', height: '36px', backgroundColor: "#1a237e"}}>2</span>
                      <span className="fw-bold" style={{color: "#1a237e"}}>Задания для закрепления</span>
                    </h2>
                    <div className="card p-4 shadow-sm">
                      <p className="fs-5 mb-4">{lessonData.practice.content}</p>

                      {lessonData.practice.tasks && lessonData.practice.tasks.length > 0 && (
                        <div className="mb-4">
                          <ol className="ps-3">
                            {lessonData.practice.tasks.map((task: string, index: number) => (
                              <li key={index} className="mb-3 fs-5">{task}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {lessonData.practice.additional && lessonData.practice.additional.length > 0 && (
                        <div className="bg-light p-4 rounded">
                          <h3 className="fs-5 fw-bold mb-3" style={{color: "#1a237e"}}>Дополнительные задания:</h3>
                          <ul className="list-unstyled ps-3">
                            {lessonData.practice.additional.map((resource: Resource, index: number) => (
                              <li key={index} className="mb-2 position-relative ps-3">
                                <span className="position-absolute" style={{left: '-10px', top: '2px'}}>•</span>
                                {resource.url ? (
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-medium" style={{color: "#1a237e"}}>
                                    {resource.title} 🔗
                                  </a>
                                ) : (
                                  <span>{resource.title}</span>
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
                // Если материалов нет и не в режиме редактирования
                <div className="card p-5 text-center shadow-sm">
                  <h2 className="fw-bold mb-3" style={{color: "#1a237e"}}>Материалы не найдены</h2>
                  <p className="fs-5 mb-4">Для выбранной темы пока не добавлены учебные материалы.</p>
                  <button 
                    className="btn text-white btn-lg mx-auto"
                    style={{backgroundColor: "#1a237e", maxWidth: '250px'}}
                    onClick={toggleEditMode}
                  >
                    Создать материал
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
