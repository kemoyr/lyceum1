"use client";

import Navbar from "../../navbar/Navbar";
import { useState } from "react";
import styles from "./page.module.css";

// Примерные данные о темах для разных классов и предметов
const educationTopics: {
  [key: string]: {
    [key: string]: string[]
  }
} = {
  "7": {
    "Математика": [
      "Целые числа и действия над ними",
      "Обыкновенные дроби",
      "Рациональные числа и действия над ними",
      "Решение уравнений",
      "Координатная плоскость",
      "Преобразование выражений"
    ],
    "Информатика": [
      "Информация и информационные процессы",
      "Компьютер как универсальное устройство обработки информации",
      "Обработка графической информации",
      "Обработка текстовой информации",
      "Мультимедиа",
      "Основы алгоритмизации",
      "Начала программирования"
    ],
    "Физика": [
      "Физические величины и их измерение",
      "Строение вещества",
      "Взаимодействие тел",
      "Давление твердых тел, жидкостей и газов",
      "Работа и мощность. Энергия"
    ]
  },
  "8": {
    "Математика": [
      "Алгебраические дроби",
      "Квадратные корни",
      "Квадратные уравнения",
      "Неравенства",
      "Системы уравнений",
      "Функции и их графики"
    ],
    "Информатика": [
      "Математические основы информатики",
      "Алгоритмы и исполнители",
      "Начала программирования",
      "Моделирование и формализация",
      "Обработка числовой информации",
      "Коммуникационные технологии"
    ],
    "Физика": [
      "Тепловые явления",
      "Изменение агрегатных состояний вещества",
      "Электрические явления",
      "Электромагнитные явления",
      "Световые явления"
    ]
  },
  "9": {
    "Математика": [
      "Неравенства и системы неравенств",
      "Системы уравнений",
      "Числовые функции",
      "Прогрессии",
      "Элементы комбинаторики, статистики и теории вероятностей"
    ],
    "Информатика": [
      "Моделирование и формализация",
      "Алгоритмизация и программирование",
      "Обработка числовой информации",
      "Коммуникационные технологии",
      "Основы логики",
      "Базы данных"
    ],
    "Физика": [
      "Законы взаимодействия и движения тел",
      "Механические колебания и волны. Звук",
      "Электромагнитное поле",
      "Строение атома и атомного ядра",
      "Ядерная физика"
    ]
  },
  "10": {
    "Математика": [
      "Действительные числа",
      "Степенная функция",
      "Показательная функция",
      "Логарифмическая функция",
      "Тригонометрические формулы",
      "Тригонометрические уравнения",
      "Тригонометрические функции"
    ],
    "Информатика": [
      "Информация и информационные процессы",
      "Компьютер и его программное обеспечение",
      "Представление информации в компьютере",
      "Элементы теории множеств и алгебры логики",
      "Современные технологии создания и обработки информационных объектов",
      "Алгоритмы и элементы программирования"
    ],
    "Физика": [
      "Механика: кинематика",
      "Механика: динамика",
      "Механика: законы сохранения",
      "Молекулярная физика. Термодинамика",
      "Основы электродинамики"
    ]
  },
  "11": {
    "Математика": [
      "Функции и их графики",
      "Производная и её геометрический смысл",
      "Применение производной к исследованию функций",
      "Первообразная и интеграл",
      "Комбинаторика и вероятность",
      "Уравнения и неравенства с двумя переменными"
    ],
    "Информатика": [
      "Обработка информации в электронных таблицах",
      "Алгоритмы и элементы программирования",
      "Информационное моделирование",
      "Сетевые информационные технологии",
      "Основы социальной информатики",
      "Искусственный интеллект"
    ],
    "Физика": [
      "Основы электродинамики (продолжение)",
      "Колебания и волны",
      "Оптика",
      "Квантовая физика",
      "Элементарные частицы",
      "Строение Вселенной"
    ]
  }
};

// Список предметов для выбора
const subjects = ["Математика", "Информатика", "Физика"];

export default function Materials() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [showTopics, setShowTopics] = useState(false);

  // Обработчик кнопки "Показать темы"
  const handleShowTopics = () => {
    if (selectedClass && selectedSubject) {
      setTopics(educationTopics[selectedClass]?.[selectedSubject] || []);
      setShowTopics(true);
    } else {
      setShowTopics(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className={styles.materialsContainer}>
          <h1 className={styles.pageTitle}>Учебные материалы</h1>
          <p className={styles.pageDescription}>
            Выберите класс и предмет для просмотра доступных тем для изучения
          </p>
          
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
            <div className={styles.topicsContainer}>
              <h2 className={styles.topicsTitle}>
                Темы по предмету &quot;{selectedSubject}&quot; для {selectedClass} класса
              </h2>
              
              {topics.length > 0 ? (
                <ul className={styles.topicsList}>
                  {topics.map((topic, index) => (
                    <li key={index} className={styles.topicItem}>
                      <div className={styles.topicCard}>
                        <h3 className={styles.topicTitle}>{topic}</h3>
                        <a href="#" className={styles.topicLink}>
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
          )}
        </div>
      </main>
    </div>
  );
}