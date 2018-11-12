import React from 'react';
import {StatusPage} from "../views";
import Announce from "../views/announce/Announce";
import Schedule from "../views/schedule/Schedule";
import Elective from "../views/electives/Elective";

const routes = [
    {
        title: "Статус подключния",
        path: "/app/status",
        component: StatusPage,
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
        component: () => <div/>
    },
    {
        title: "Праздники",
        path: "/app/holidays",
        component: () => <div/>
    }
];

export default routes;
