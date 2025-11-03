export interface Auditable {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    createBy: string;
    updateBy: string;
    isDeleted: boolean;
}
