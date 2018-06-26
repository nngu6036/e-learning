import { BaseModel } from '../base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model,FieldProperty } from '../decorator';
import { APIContext } from '../context';
import * as _ from 'underscore';
import { SearchReadAPI } from '../../services/api/search-read.api';
import { CreateAPI } from '../../services/api/create.api';

@Model('emeeting.member')
export class RoomMember extends BaseModel{

    constructor(){
        super();
        
        this.avatar = undefined;
        this.name = undefined;
        this.ref = undefined;
        this.email = undefined;
        this.room_id = undefined;
        this.is_supervisor = undefined;
    }

    avatar: string;
    name: string;
    ref: string;
    email: string;
    room_id: number;
    is_supervisor: boolean;

    static __api__byRef(ref: string): SearchReadAPI {
        return new SearchReadAPI(RoomMember.Model, [],"[('ref','!=','"+ref+"')]");
    }

    static byRef(context:APIContext, ref: string):Observable<any> {
        return RoomMember.single(context,[],"[('ref','=','"+ref+"')]");
    }

    static createRoomMember(name: string, avatar: string, roomId: number, role:string): RoomMember {
        var roomMember = new RoomMember();
        roomMember.room_id =  roomId;
        roomMember.name =  name;
        roomMember.avatar = avatar;
        roomMember.is_supervisor =  role =='teacher';
        roomMember.ref = RoomMember.makeid();
        return roomMember;
    }

    static makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 24; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}