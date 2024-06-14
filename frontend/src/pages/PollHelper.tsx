export interface PollData {
    ID: string;
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
    ID: string;
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
    ID: string;
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
