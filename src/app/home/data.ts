export class Day{
    date: string;
    color: string;
    circle: string; //pour encercler la date selectionnée
}

export class Week {
    dim?: Day;
    lun?: Day;
    mar?: Day;
    mer?: Day;
    jeu?: Day;
    ven?: Day;
    sam?: Day;
}