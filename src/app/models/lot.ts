import {LotInterface} from './lot-interface';

export class Lot implements LotInterface {
    id: number;
    text: string;

    get imageLink(): string {
        return 'https://static.csgomix.com/uploads/spinking/' + this.id + '.png';
    }

    static fromJson(json: any) {
        const lot = new Lot();

        lot.id = json.id;
        lot.text = json.text;

        return lot;
    }
}
