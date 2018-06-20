export interface AlarmData {
    id: number;
    text: string;
    trigger: {
        at: Date;
    }
}