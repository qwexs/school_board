import React from 'react';
import {StatusPage} from "../views/index";
import Announce from "../views/announce/Announce";
import Schedule from "../views/schedule/Schedule";
import Elective from "../views/electives/Elective";
import Gallery from "../views/gallery/Gallery";

const routes = [
    {
        title: "Подключния",
        path: "/app/status",
        component: StatusPage,
    },
    {
        title: "Новости",
        path: "/app/news",
        component: ()=><div/>,
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
