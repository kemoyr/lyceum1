import type { Route } from "./+types/home";
import NavBar from "../navBar/navBar";
import './home.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Лицей Иннополис - Главная" },
    { name: "description", content: "Официальный образовательный сайт Лицея Иннополис с учебными материалами для учеников" },
  ];
}

export default function Home() {
  return (
    <div className="">
      <NavBar />
      
      <main className="container">
        {/* Hero Section */}
        <section className="hero text-center">
          <div className="row">
            <div className="col-md-10 mx-auto">
              <h1>Добро пожаловать на образовательный портал Лицея Иннополис</h1>
              <p>Цифровая платформа для поддержки учебного процесса и доступа к образовательным материалам</p>
              <a href="/materials" className="btn-primary">Перейти к материалам</a>
            </div>
          </div>
        </section>

        {/* About Lyceum Section */}
        <section className="section">
          <div className="row">
            <div className="col-md-6">
              <div className="image-container">
                <img src="/17_innopolis.jpg" alt="Лицей Иннополис" />
              </div>
            </div>
            <div className="col-md-6">
              <h2 className="section-title">О Лицее Иннополис</h2>
              <p>Лицей Иннополис - учебное заведение с акцентом на физико-математические науки, изучение IT и развитие творческих и исследовательских способностей. В лицее учатся с 7-го по 11-й классы.</p>
              <p>Основан в 2015 году в городе Иннополис — первом российском городе, созданном для IT-специалистов.</p>
              <p>Обучение, проживание и питание — бесплатные. В лицее есть бассейн, спортзал, гончарная мастерская.</p>
              <p>Лицей входит в топ-5 школ Татарстана и в топ-100 по России по конкурентоспособности выпускников.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section">
          <h2 className="section-title text-center">Возможности образовательного портала</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <h3>Учебные материалы</h3>
                <p>Доступ к лекциям, презентациям и конспектам по всем предметам для учеников, пропустивших занятия</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <h3>Домашние задания</h3>
                <p>Актуальные домашние задания с возможностью их выполнения и отправки на проверку через сайт</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <h3>Дополнительные материалы</h3>
                <p>Подборка полезных ресурсов для углубленного изучения предметов и подготовки к олимпиадам</p>
              </div>
            </div>
          </div>
        </section>

        {/* Education Focus */}
        <section className="section">
          <h2 className="section-title text-center">Образовательный фокус лицея</h2>
          <div className="row">
            <div className="col-md-6">
              <div className="feature-card">
                <h3>IT и программирование</h3>
                <p>Углубленное изучение информационных технологий, языков программирования и разработки программного обеспечения</p>
              </div>
              <div className="feature-card">
                <h3>Физико-математическое направление</h3>
                <p>Специализированная подготовка по физике и математике, ориентированная на участие в олимпиадах и поступление в ведущие вузы</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-card">
                <h3>Творческое развитие</h3>
                <p>В Лицее работает активное волонтерское движение, самоуправление, проходит множество олимпиад и хакатонов</p>
              </div>
              <div className="feature-card">
                <h3>Кружки и секции</h3>
                <p>Творческие кружки по танцам, театру, музыке, спортивные секции и другие дополнительные занятия</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="contact-info mb-5">
          <h3>Контактная информация</h3>
          <div className="contact-item">
            <strong>Адрес:</strong> 420500, Российская Федерация, Республика Татарстан, г. Иннополис, Квантовый бульвар, дом 1
          </div>
          <div className="contact-item">
            <strong>Телефон:</strong> 8(843)590-23-48
          </div>
          <div className="contact-item">
            <strong>E-Mail:</strong> Licey.Innopolis@tatar.ru
          </div>
          <div className="contact-item">
            <strong>Руководитель:</strong> Костанян Арман Артурович
          </div>
        </section>
      </main>
    </div>
  )
}
