import React, { ReactNode } from 'react';
import styles from './calendar.module.css'

// モーダルウィンドウ
// show: モーダルを表示するかどうかのブール値
// onClose: モーダルを閉じるときに呼ばれる関数
// children: モーダル内に表示される子要素（モーダルのコンテンツ）

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default Modal;