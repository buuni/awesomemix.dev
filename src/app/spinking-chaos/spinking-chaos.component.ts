import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Lot} from '../models/lot';
import {
    trigger, state, style, transition, animate, keyframes, sequence, group, AnimationBuilder,
    AnimationPlayer, animation, AnimationReferenceMetadata, AnimationFactory
} from '@angular/animations';

import {LOTS} from '../lots-types.ext';

@Component({
    selector: 'app-spinking-chaos',
    templateUrl: './spinking-chaos.component.html',
    styleUrls: ['./spinking-chaos.component.css']
})
export class SpinkingChaosComponent implements OnInit {
    @ViewChild('wrapper')
    wrapper;

    renderLots: Lot[];

    _lots: Lot[];
    _currentPlayer: AnimationPlayer;
    _targetItemId?: number = null;

    _itemSize: number;
    _animations?: {[name: string]: (argument?: any) => AnimationReferenceMetadata} | Array<any> = [];
    _factories?: {[name: string]: AnimationFactory} | Array<any> = [];
    _players?: {[name: string]: AnimationPlayer} | Array<any> = [];

    constructor(private builder: AnimationBuilder) {
        this._lots = LOTS.map(item => {
            return Lot.fromJson(item);
        });

        this._lots = this._shuffle(this._lots);
        this._itemSize = 200;

        // Для правильного отображения дублируем некоторые лоты
        // TODO вынести в отдельный компонент

        this.renderLots = [].concat(this._lots);
        this.renderLots.unshift(this.renderLots[this.renderLots.length - 1]);
        this.renderLots.push(this.renderLots[1]);
        this.renderLots.push(this.renderLots[2]);
    }

    ngOnInit() {
        this._animations['in'] = () => animation([
            animate('1.0s ease-in', keyframes([
                style({transform: 'translateX({{ end }}px)', offset: 0.9999999}),
                style({transform: 'translateX(0)', offset: 1}),
            ])),
        ], {params: {end: -this._itemSize * this._lots.length}});

        this._animations['process'] = () => animation([
            animate('0.5s', keyframes([
                style({transform: 'translateX({{ end }}px)', offset: 0.9999999}),
                style({transform: 'translateX(0)', offset: 1}),
            ]))
        ], {params: {end: -this._itemSize * this._lots.length}});

        this._animations['end'] = (index: number) => {
            let offset = Math.random() * (80);

            if (Math.random() > 0.5) {
                console.log('right');
                offset = -offset;
            }

            return animation([
                animate('4s ease-out', keyframes([
                    style({transform: 'translateX({{ end }}px)', offset: 1}),
                ])) 
            ], {params: {end: -this._itemSize * (index) + offset}});
        };

        this._factories['in'] = this.builder.build(this._animations['in']());
        this._factories['process'] = this.builder.build(this._animations['process']());
    }

    private _getIndexByLotId(id: number) {
        let index = 0;

        this._lots.forEach((item, i) => {
            if (item.id === id) {
                index = i;
                console.log(item.text);
            }
        });
        console.log(id);
        console.log(index);
        return index;
    }

    private _endAnimation() {

    }

    private _preEndAnimation() {

    }

    private _restartAnimation() {
        if (this._targetItemId) {
            this._factories['end'] = this.builder.build(
                this._animations['end'](this._getIndexByLotId(this._targetItemId)));
            this._currentPlayer = this._factories['end'].create(this.wrapper.nativeElement, {});
            this._currentPlayer.play();
        } else {
            this._currentPlayer = this._players['process'];
            this._currentPlayer.restart();
            this._currentPlayer.onDone(this._restartAnimation.bind(this));
        }
    }

    startGame() {

        setTimeout(() => {
            console.log('generate');
            this._targetItemId = this._lots[Math.floor(Math.random() * (this._lots.length - 1))].id;

        }, 500);

        this._targetItemId = null;

        if (this._players['in']) {
            this._players['in'].destroy();
        }

        if (this._players['process']) {
            this._players['process'].destroy();
        }

        if (this._players['end']) {
            this._players['end'].destroy();
        }

        this._players['in'] = this._factories['in'].create(this.wrapper.nativeElement, {});
        this._players['process'] = this._factories['process'].create(this.wrapper.nativeElement, {});

        this._currentPlayer = this._players['in'];

        this._currentPlayer.onDone(this._restartAnimation.bind(this));

        this._currentPlayer.onDestroy(() => {
            console.log('destroyed');
        });

        this._currentPlayer.play();
    }

    private _shuffle(array) {
        let counter = array.length;

        while (counter > 0) {
            const index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            const temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }
}
