export interface ParaDTO {
    paragraph: string;
    ip: string;
    count?: number;
}

export interface ParaEntity {
    id: string;
    paragraph: string;
    ip: string;
    count: number;
    pdfLink?: string;
    createdAt: Date;
    updatedAt: Date;
}
