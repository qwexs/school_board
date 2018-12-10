import React from 'react';
import ReactDOM from "react-dom";

const modalRoot = document.getElementById('modal');

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        /*
          Элемент портала вставлен в дерево DOM после того, как потомки Modal
        были монтированы, что означает, что потомки будут монтированы в отдельный
        узел DOM.
          Если дочерний компонент требует присоединения к дереву DOM сразу после
        его монтирования, например, для измерения узла DOM или использования
        «autoFocus» в потомке, добавьте состояние в Modal и отрисуйте дочерние
        элементы, после того, как Modal будет вставлен в DOM дерево.
        */
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el,
        );
    }
}

export default Modal;
