export declare class StaffModel {
    id: number;
    agentId: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class StaffModelUpdateByAgent {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    status: string;
}
export declare class StaffModelUpdate {
    name: string;
    phone: string;
    password: string;
}
