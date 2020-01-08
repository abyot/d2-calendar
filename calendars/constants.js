const ethiopian = {
    EPOCH: 1724220.5, // 008/08/29 Julian C.E.
    EPOCH_RD: 2796,
    monthNames: [
        'Meskerem',
        'Tikemet',
        'Hidar',
        'Tahesas',
        'Tir',
        'Yekatit',
        'Megabit',
        'Miazia',
        'Genbot',
        'Sene',
        'Hamle',
        'Nehase',
        'Pagume'
    ],
    monthNamesShort: [
        'Mes',
        'Tik',
        'Hid',
        'Tah',
        'Tir',
        'Yek',
        'Meg',
        'Mia',
        'Gen',
        'Sen',
        'Ham',
        'Neh',
        'Pag'
    ],
    dayNames: [
        'Ehud',
        'Segno',
        'Maksegno',
        'Irob',
        'Hamus',
        'Arb',
        'Kidame'
    ],
    dayNamesShort: [
        'Ehu',
        'Seg',
        'Mak',
        'Iro',
        'Ham',
        'Arb',
        'Kid'
    ],
    dayNamesMin: [
        'Eh',
        'Se',
        'Ma',
        'Ir',
        'Ha',
        'Ar',
        'Ki'
    ],
};

const gregorian = {
    EPOCH: 1721425.5, // 001/01/03 Julian C.E.
    EPOCH_RD: 730120.5,
    MONTHS: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    Month: {
        JANUARY: 1,
        FEBRUARY: 2,
        MARCH: 3,
        APRIL: 4,
        MAY: 5,
        JUNE: 6,
        JULY: 7,
        AUGUST: 8,
        SEPTEMBER: 9,
        OCTOBER: 10,
        NOVEMBER: 11,
        DECEMBER: 12
    }
}

export {
    gregorian,
    ethiopian
}