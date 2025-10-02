# Agents Guidelines

## Icon Usage Policy

### **CRITICAL RULE: ONLY Font Awesome Icons**

This project **STRICTLY** uses Font Awesome icons only. Under **NO CIRCUMSTANCES** should any other icon library or icon format be used.

### What's Already Configured

The project includes these Font Awesome packages:
- `@fortawesome/fontawesome-svg-core`
- `@fortawesome/free-solid-svg-icons`
- `@fortawesome/free-regular-svg-icons`
- `@fortawesome/vue-fontawesome`

### Current Icon Registration

The project already registers 70+ Font Awesome icons in `src/main.js`, including:

**Solid Icons (most commonly used):**
- Navigation: `faPhone`, `faChevronDown`, `faArrowLeft`, `faEllipsisVertical`
- Actions: `faEdit`, `faTrashCan`, `faSearch`, `faPlus`, `faMinus`, `faCheck`
- Business: `faBuilding`, `faUsers`, `faDollarSign`, `faUniversity`
- UI Elements: `faCog`, `faEye`, `faSpinner`, `faGripVertical`
- Communication: `faPhoneVolume`, `faComments`, `faEnvelope`, `faPaperPlane`
- Charts/Data: `faChartLine`, `faChartBar`, `faChartPie`, `faTable`

**Regular Icons:**
- `faEnvelopeRegular`, `faUserCircleRegular`, `faCalendarAltRegular`, `faFileAltRegular`

### Adding New Icons

When adding new icons:

1. **Import** the icon in `src/main.js`:
```javascript
import { faNewIcon } from '@fortawesome/free-solid-svg-icons'
```

2. **Register** it in the library:
```javascript
library.add(faNewIcon)
```

3. **Use** it in components:
```vue
<font-awesome-icon :icon="['fas', 'newIcon']" />
```

### Forbidden Icon Sources

**NEVER USE:**
- Material Design Icons
- Heroicons
- Feather Icons
- Ionic Icons
- Bootstrap Icons
- Custom SVG files as icons
- Unicode symbols (⋮, ▼, ✕, etc.)
- Google Fonts icons
- Any other icon library except Font Awesome

### Icon Naming Conventions

- Use camelCase for icon names in JavaScript: `faNewIcon`, `faUserGroup`
- Use kebab-case in Vue templates: `['fas', 'new-icon']`, `['fas', 'user-group']`

### Troubleshooting

If an icon doesn't appear:
1. Check it's imported and registered in `main.js`
2. Verify the icon exists in Font Awesome's library
3. Ensure correct syntax: `['fas', 'icon-name']` for solid, `['far', 'icon-name']` for regular

### Maintenance

- Review `src/main.js` periodically to clean up unused icons
- Keep icon imports organized by category
- Document new icon additions when they represent new functionality

---

**Remember: Consistency in icon usage is crucial for user experience. Font Awesome provides the reliability and comprehensive icon set this project requires.**
