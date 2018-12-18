import React from 'react';
import Announce from "../views/announce/Announce";
import Schedule from "../views/schedule/Schedule";
import Elective from "../views/electives/Elective";
import Gallery from "../views/gallery/Gallery";
import News from "../views/news/News";

const routes = [
    {
        title: "Новости",
        path: "/app/news",
        component: News,
    },
    {
        title: "Расписание уроков",
        path: "/app/schedule",
        component: Schedule
    },
    {
        title: "Анонсы и события",
        path: "/app/announce",
        component: Announce
    },
    {
        title: "Распорядок дня",
        path: "/app/electives",
        component: Elective
    },
    {
        title: "Галерея",
        path: "/app/gallery",
        component: Gallery
    },
    {
        title: "Праздники",
        path: "/app/holidays",
        component: () => <div/>
    }
];

export default routes;
