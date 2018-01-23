import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {MenuItem} from 'primeng/primeng';

/**
 * This class represents the lazy loaded HomeComponent.
 */
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'hrm-dashboard',
    templateUrl: 'dashboard.component.html'

})
export class DashboardComponent {
	cities: any[];

    cars: any[];

    chartData: any;

    events: any[];

    selectedCity: any;

    items: MenuItem[];

    header: any;

ngOnInit() {


        this.cities = [];
        this.cities.push({label: 'Select City', value: null});
        this.cities.push({label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}});
        this.cities.push({label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}});
        this.cities.push({label: 'London', value: {id: 3, name: 'London', code: 'LDN'}});
        this.cities.push({label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}});
        this.cities.push({label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}});

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#FFC107'
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#03A9F4'
                }
            ]
        };

        this.items = [
            {label: 'Save', icon: 'ui-icon-check'},
            {label: 'Update', icon: 'ui-icon-refresh'},
            {label: 'Delete', icon: 'ui-icon-delete'}
        ];

        this.header = {
            left: 'prev, next today',
            center: 'title',
            right: 'month, agendaWeek, agendaDay'
        };
    }

}

