import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { APIService } from '../../shared/services/api.service';
import { WebSocketService } from '../../shared/services/socket.service';
import { Router } from '@angular/router';
import { User } from '../../shared/models/elearning/user.model';
import { CloudAccount } from '../../shared/models/cloud/cloud-account.model';
import { LANGS } from '../../shared/models/constants';
import { HomeEventManager } from '../home-manager.service';
import { HomeComponent } from '../home.component';
import { SettingService } from '../../shared/services/setting.service';
import { SelectItem } from 'primeng/primeng';
import { BaseComponent } from '../../shared/components/base/base.component';
import { Notification } from '../../shared/models/ticket/notification.model';
import { Ticket } from '../../shared/models/ticket/ticket.model';
import { TicketDialog } from '../../workflow/ticket-dialog/ticket-dialog.component';
import * as _ from 'underscore'

@Component({
	moduleId: module.id,
	selector: 'app-navbar',
	templateUrl: 'navbar.component.html',
})
export class NavbarComponent extends BaseComponent implements OnInit {

	private user: User;
	private notifs: Notification[];
	private langs: SelectItem[];
	private viewMode: string;
	@Input() selectedLang: string;
	@Input() adminMode: boolean;
	@ViewChild(TicketDialog) ticketDialog: TicketDialog;

	constructor(private router: Router, private parent: HomeComponent,
		private eventManager: HomeEventManager, private socketService: WebSocketService) {
		super();
		this.langs = _.map(LANGS, (val, key) => {
			return { label: val, value: key };
		});
		this.selectedLang = this.translateService.currentLang;
		this.notifs = [];
	}

	ngOnInit() {
		this.user = this.authService.UserProfile;
		this.viewMode = this.settingService.ViewMode;
		this.loadNotification();
		this.socketService.join(this.user.id, this.authService.CloudAcc.id);
		this.socketService.onNotify.subscribe(data => {
			this.loadNotification();
		});
	}

	loadNotification() {
		Notification.listByUser(this, this.user.id).subscribe(notifs => {
			this.notifs = notifs;
		});
	}

	showTicket(notif: Notification) {
		Ticket.get(this, notif.ticket_id).subscribe(ticket => {
			this.ticketDialog.show(ticket);
			notif.delete(this).subscribe(() => {
				this.loadNotification();
			})
		});
	}

	selectLang($event: any) {
		this.settingService.Lang = $event.value;
		this.translateService.use($event.value);
		this.chooseTypeReport();
	}

	setViewMode(mode) {
		this.viewMode = mode;
		this.settingService.ViewMode = mode;
		this.router.navigate(['/dashboard']);
	}
}


