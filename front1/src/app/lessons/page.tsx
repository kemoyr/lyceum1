"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import styles from "./page.module.css";
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
const lessonMaterials: LessonMaterialsType = {
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
        setLessonData(lessonMaterials[subjectParam][topicParam]);
      } else {
        setLessonData(null);
      }
      setLoading(false);
    }, 500);
  }, [searchParams]);

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
          ) : lessonData ? (
            <>
              <div className={styles.lessonHeader}>
                <Link href="/materials" className={styles.backLink}>
                  ← Вернуться к темам
                </Link>
                <div className={styles.lessonInfo}>
                  <h4 className={styles.classSubject}>
                    {lessonClass} класс - {subject}
                  </h4>
                  <h1 className={styles.topicTitle}>{topic}</h1>
                </div>
              </div>

              <div className={styles.lessonContent}>
                {/* Секция 1: Теоретические материалы */}
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionNumber}>1</span> Изучение материала
                  </h2>
                  <div className={styles.theoryCard}>
                    {lessonData.theory.type === "text" && (
                      <div className={styles.theoryText}>
                        <p>{lessonData.theory.content}</p>
                      </div>
                    )}

                    {lessonData.theory.additional && (
                      <div className={styles.additionalResources}>
                        <h3>Дополнительные материалы:</h3>
                        <ul>
                          {lessonData.theory.additional.map((resource: Resource, index: number) => (
                            <li key={index}>
                              {resource.url ? (
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
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
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionNumber}>2</span> Задания для закрепления
                  </h2>
                  <div className={styles.practiceCard}>
                    <p>{lessonData.practice.content}</p>

                    {lessonData.practice.tasks && (
                      <div className={styles.tasksList}>
                        <ol>
                          {lessonData.practice.tasks.map((task: string, index: number) => (
                            <li key={index} className={styles.taskItem}>{task}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {lessonData.practice.additional && (
                      <div className={styles.additionalResources}>
                        <h3>Дополнительные задания:</h3>
                        <ul>
                          {lessonData.practice.additional.map((resource: Resource, index: number) => (
                            <li key={index}>
                              {resource.url ? (
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
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
            </>
          ) : (
            <div className={styles.noDataContainer}>
              <h2>Материалы не найдены</h2>
              <p>Для выбранной темы пока не добавлены учебные материалы.</p>
              <Link href="/materials" className={styles.backLink}>
                ← Вернуться к темам
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
