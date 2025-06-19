// components/EquipmentPopup.jsx

import styles from '../Style/EquipmentPopup.module.css';

const EquipmentPopup = ({ equipments }) => {
  return (
    <div className={styles.popupContainer}>
      {equipments.map((eq, index) => (
        <div key={eq.gid || index} className={styles.card}>
          <h4>{eq.name || 'Equipment'}</h4>
          <div className={styles.grid}>
            <span><strong>Barcode:</strong></span>   <span>{eq.barcode ?? '-'}</span>
            <span><strong>Equipment:</strong></span> <span>{eq.equipment_ ?? '-'}</span>
            <span><strong>Point ID:</strong></span>  <span>{eq.pointid ?? '-'}</span>
            <span><strong>GID:</strong></span>       <span>{eq.gid ?? '-'}</span>
            <span><strong>Active:</strong></span>    <span>{new Date(eq.activedate).toLocaleDateString() ?? '-'}</span>
            <span><strong>Inactive:</strong></span>  <span>{new Date(eq.inactiveda).toLocaleDateString() ?? '-'}</span>
            <span><strong>Campaign Start:</strong></span>  <span>{eq.campaign_s ?? '-'}</span>
            <span><strong>Campaign End:</strong></span>    <span>{eq.campaign_e ?? '-'}</span>
            <span><strong>Notes:</strong></span>     <span>{eq.notes ?? '-'}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EquipmentPopup;