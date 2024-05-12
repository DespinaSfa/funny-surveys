export interface PollData {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    UserID: number;
    Title: string;
    Description: string;
    PollType: string;
    PollParties: PollParty[];
    PollWeddings: PollWedding[];
}

export interface PollParty {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    PollID: number;
    SongToBePlayed: string;
    CurrentAlcoholLevel: number;
    PreferredAlcoholLevel: number;
    FavoriteActivity: string;
    WishSnack: string;
}

export interface PollWedding {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    PollID: number;
    WeddingInvite: string;
    KnowCoupleSince: number;
    KnowCoupleFromWhere: string;
    WeddingHighlight: string;
    CoupleWish: string;
}

// WEDDING
export const calculateWeddingCounts = <T extends keyof PollWedding>(weddings: PollWedding[], field: T): { [key: string]: number } => {
    const counts: { [key: string]: number } = {};
    weddings.forEach(wedding => {
        const value = wedding[field];
        counts[String(value)] = (counts[String(value)] || 0) + 1;
    });
    return counts;
};

export const calculateAverageKnownCoupleSince = (weddings: PollWedding[]) => {
    if (weddings.length === 0) {
        return 0;
    }
    const totalKnowCoupleSince = weddings.reduce((acc, wedding) => acc + wedding.KnowCoupleSince, 0);
    return totalKnowCoupleSince / weddings.length;
};

// PARTY
export const calculateCounts = <T extends keyof PollParty>(parties: PollParty[], field: T): { [key: string]: number } => {
    const counts: { [key: string]: number } = {};
    parties.forEach(party => {
        const value = party[field]?.toString();
        if (value !== undefined) {
            counts[value] = (counts[value] || 0) + 1;
        }
    });
    return counts;
};


