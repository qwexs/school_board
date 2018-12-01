module.exports.getEmptyAnnounce = () => {
    const newDate = new Date();
    return [
        {title:"Понедельник", date: newDate, education:[]},
        {title:"Вторник", date: newDate, education:[]},
        {title:"Среда", date: newDate, education:[]},
        {title:"Четверг", date: newDate, education:[]},
        {title:"Пятница", date: newDate, education:[]},
        {title:"Суббота", date: newDate, education:[]},
        {title:"Воскресенье", date: newDate, education:[]},
    ];
};
