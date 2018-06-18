import { Component, AfterViewInit, OnInit, Input, ComponentFactoryResolver, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { APIService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';
import { Group } from '../../shared/models/elearning/group.model';
import { BaseDialog } from '../../shared/components/base/base.dialog';
import { Competency } from '../../shared/models/elearning/competency.model';
import * as _ from 'underscore';
import { TreeUtils } from '../../shared/helpers/tree.utils';
import { TreeNode } from 'primeng/api';
import { CompetencyLevel } from '../../shared/models/elearning/competency-level.model';
import { BaseModel } from '../../shared/models/base.model';


@Component({
	moduleId: module.id,
	selector: 'competency-dialog',
	templateUrl: 'competency-dialog.component.html',
})
export class CompetencyDialog extends BaseDialog<Competency>  {

	private tree: TreeNode[];
	private selectedNode: TreeNode;
	private treeUtils: TreeUtils;
	private levels: CompetencyLevel[];

	constructor(private componentFactoryResolver: ComponentFactoryResolver, private changeDetectionRef: ChangeDetectorRef) {
		super();
		this.treeUtils = new TreeUtils();
		this.levels = [];
	}

	nodeSelect(event: any) {
		if (this.selectedNode) {
			this.object.group_id = this.selectedNode.data.id;
			this.object.group_id__DESC__ = this.selectedNode.data.name;
		}
	}

	ngOnInit() {
		this.onShow.subscribe(object => {
			if (object.id)
				BaseModel.bulk_search(this, Group.__api__listCompetencyGroup(), CompetencyLevel.__api__listByCompetency(object.id))
					.subscribe(jsonArr => {
						var groups = Group.toArray(jsonArr[0]);
						this.tree = this.treeUtils.buildGroupTree(groups);
						if (object.group_id) {
							this.selectedNode = this.treeUtils.findTreeNode(this.tree, object.group_id);
						}
						this.levels = CompetencyLevel.toArray(jsonArr[1]);
					});
			this.buildCompetencyTree(object);

		});
	}

	buildCompetencyTree(object) {
		Group.listCompetencyGroup(this).subscribe(groups => {
			this.tree = this.treeUtils.buildGroupTree(groups);
			if (object.group_id) {
				this.selectedNode = this.treeUtils.findTreeNode(this.tree, object.group_id);
			}
		});
	}


	addCompetencyLevel() {
		var level = new CompetencyLevel();
		level.name = 'New level';
		this.levels.push(level);
	}

	updateCompetencyLevel(): Observable<any> {
		var subscriptions = _.map(this.levels, (level: CompetencyLevel) => {
			if (!level.name || level.name == '') {
				if (level.id)
					return level.delete(this);
				else
					return Observable.of(true);
			} else {
				level.competency_id = this.object.id;
				return level.save(this);
			}
		});
		if (subscriptions.length)
			return Observable.forkJoin(...subscriptions);
		else
			return Observable.of(true);
	}

	saveWithLevel() {
		if (!this.object.id) {
			this.object.save(this).subscribe(() => {
				this.updateCompetencyLevel().subscribe(() => {
					this.onCreateCompleteReceiver.next(this.object);
					this.success(this.translateService.instant('Object created successfully.'));
					this.hide();
				});
			}, () => {
				this.error(this.translateService.instant('Permission denied'));
			});
		}
		else {
			this.object.save(this).subscribe(() => {
				this.updateCompetencyLevel().subscribe(() => {
					this.onUpdateCompleteReceiver.next(this.object);
					this.success(this.translateService.instant('Object saved successfully.'));
					this.hide();
				});
			}, () => {
				this.error(this.translateService.instant('Permission denied'));
			});
		}
	}

}


