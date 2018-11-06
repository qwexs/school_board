import React from 'react';

export default ({...props}) => {
    const {children} = props;
    return (
        <div className="footer-apply">
            {children.map((element, index) => {
                return(
                    <div key={index} style={{height:"100%", paddingRight:15, display:"flex", alignSelf:"center"}}>
                        {element}
                    </div>
                );
            })}
        </div>
    );
}
