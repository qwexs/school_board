import React from 'react';
import { Button } from "@blueprintjs/core";

export default ({...props}) => {
    return (
        <div className="footer-apply">
            <div style={{paddingRight:15, height:"100%", display:"flex", alignSelf:"center"}}>
                <Button minimal icon="edit" >Сохранить</Button>
            </div>
            <div style={{height:"100%", display:"flex", alignSelf:"center"}}>
                <Button minimal icon="undo">Отменить</Button>
            </div>
        </div>
    );
}
