import {Component, Input, OnInit} from '@angular/core';
import {Lot} from '../../models/lot';

@Component({
    selector: 'app-lot',
    templateUrl: './lot.component.html',
    styleUrls: ['./lot.component.css']
})
export class LotComponent implements OnInit {

    @Input() lot: Lot;

    constructor() {
    }

    ngOnInit() {
    }

}
