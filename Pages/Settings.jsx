import React from 'react';
import styles from './Game.module.css';

class Settings extends React.Component {
  render() {
    return (
      <main className={ styles.container }>
        <h2 data-testid="settings-title">Settings</h2>
      </main>
    );
  }
}

export default Settings;
