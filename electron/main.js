const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 980,
    height: 720,
    minWidth: 840,
    minHeight: 560,
    title: 'SmartPay',
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    }
  });

  const indexPath = path.join(__dirname, '..', 'index.html');
  mainWindow.loadFile(indexPath);

  // Définition d'un menu personnalisé
  const template = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'Rafraîchir',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          }
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'togglefullscreen', label: 'Plein écran' }
      ]
    },
    {
      label: 'À propos',
      submenu: [
        {
          label: 'À propos de SmartPay',
          click: () => {
            // on ne peut pas utiliser require dans executeJavaScript côté renderer (sandboxé).
            const packageJson = require('../package.json');
            const version = packageJson.version;

            mainWindow.webContents.executeJavaScript(`
              (() => {
                if (document.getElementById('smartpay-about-modal')) return;
                const modal = document.createElement('div');
                modal.id = 'smartpay-about-modal';
                modal.style.position = 'fixed';
                modal.style.top = 0;
                modal.style.left = 0;
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.background = 'rgba(0,0,0,0.25)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = 9999;

                const box = document.createElement('div');
                box.style.background = '#fff';
                box.style.borderRadius = '12px';
                box.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
                box.style.padding = '32px 28px 20px 28px';
                box.style.minWidth = '320px';
                box.style.maxWidth = '90vw';
                box.style.textAlign = 'center';
                box.style.position = 'relative';
                box.style.fontFamily = 'Inter, Arial, sans-serif';

                const icon = document.createElement('img');
                icon.src = 'assets/icon.png';
                icon.alt = 'Icône SmartPay';
                icon.style.width = '64px';
                icon.style.height = '64px';
                icon.style.borderRadius = '10px';
                icon.style.marginBottom = '18px';
                box.appendChild(icon);

                const title = document.createElement('h2');
                title.textContent = 'SmartPay';
                title.style.margin = '0 0 8px 0';
                title.style.fontWeight = '700';
                title.style.fontSize = '1.5rem';
                box.appendChild(title);

                const desc = document.createElement('div');
                desc.innerHTML = "<p style='margin:0 0 8px 0;font-size:1.05rem;'>Calculateur de billets nécessaires pour une somme en Ariary</p><p style='margin:0 0 12px 0;font-size:0.98rem;color:#555;'>Par Augusta Rabemananjara</p>";
                box.appendChild(desc);

                const version = document.createElement('div');
                version.style.fontSize = '0.93rem';
                version.style.color = '#888';
                version.style.marginBottom = '16px';
                version.textContent = 'Version ${version}';
                box.appendChild(version);

                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Fermer';
                closeBtn.style.background = '#2d7d46';
                closeBtn.style.color = '#fff';
                closeBtn.style.border = 'none';
                closeBtn.style.borderRadius = '6px';
                closeBtn.style.padding = '8px 22px';
                closeBtn.style.fontSize = '1rem';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.marginTop = '8px';
                closeBtn.addEventListener('click', () => {
                  modal.remove();
                });
                box.appendChild(closeBtn);

                modal.appendChild(box);
                modal.addEventListener('click', (e) => {
                  if (e.target === modal) modal.remove();
                });
                document.body.appendChild(modal);
              })();
            `);
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});