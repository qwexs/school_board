import Announce from "../views/announce/Announce";
import Schedule from "../views/schedule/Schedule";
import Elective from "../views/electives/Elective";
import Gallery from "../views/gallery/Gallery";
import News from "../views/news/News";
import Holidays from "../views/holidays/Holidays";

const routes = [
    {
        title: "Новости",
        path: "/app/news",
        icon: "/assets/menu_icons/news.png",
        component: News
    },
    {
        title: "Расписание уроков",
        path: "/app/schedule",
        icon: "/assets/menu_icons/task.png",
        component: Schedule
    },
    {
        title: "Анонсы и события",
        path: "/app/announce",
        icon: "/assets/menu_icons/flag.png",
        component: Announce
    },
    {
        title: "Распорядок дня",
        path: "/app/electives",
        icon: "/assets/menu_icons/electives.png",
        component: Elective
    },
    {
        title: "Галерея",
        path: "/app/gallery",
        icon: "/assets/menu_icons/gallery.png",
        component: Gallery
    },
    {
        title: "Праздники",
        path: "/app/holidays",
        icon: "/assets/menu_icons/celebration.png",
        component: Holidays
    }
];

export default routes;
