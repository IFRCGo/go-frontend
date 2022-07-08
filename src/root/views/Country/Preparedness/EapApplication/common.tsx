export interface EapsFields {
    name: string;
    room: string;
}
export interface BooleanValueOption {
    value: boolean;
    label: string;
}

export const eventDetailsFields: (keyof EapsFields)[] = [
    'name',
    'room',
];

export const overviewFields: (keyof EapsFields)[] = [
    'name',
    'room',
];

export const contactFields: (keyof EapsFields)[] = [
    'name',
    'room',
];
