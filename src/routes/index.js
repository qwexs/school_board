import React from 'react';
import {SchedulePage, StatusPage} from "../views";

const routes = [
    {
        title: "Статус подключния",
        path: "/app/status",
        component: StatusPage,
    },
    {
        title: "Расписание уроков",
        path: "/app/schedule",
        component: SchedulePage
    },
    {
        title: "Анонсы и события",
        path: "/app/anons",
        component: () => <div/>
    },
    {
        title: "Распорядок дня",
        path: "/app/electives",
        component: () => <div/>
    },
    {
        title: "Галерея",
        path: "/app/gallery",
        component: () => <div/>
    },
    {
        title: "Праздники",
        path: "/app/holidays",
        component: () => <div/>
    }
];

export default routes;
