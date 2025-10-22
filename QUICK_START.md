# Quick Start Guide

## Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Seed Demo Data
```bash
npm run seed
```

### 3️⃣ Start the Application
```bash
npm run dev
```

## Login

Open [http://localhost:3000](http://localhost:3000) and login with:

```
Email:    demo@example.com
Password: demo123
```

## What You'll See

### Dashboard
- **4 Metric Cards**: Revenue, Orders, Inventory, Employees
- **2 Charts**: Revenue trends and Inventory status
- **Recent Activity**: Latest transactions
- **Alerts**: Low stock and pending approvals

### Inventory (50 Products)
- Electronics, Furniture, Office Supplies
- Stock levels and reorder alerts
- SKU codes and pricing
- Search and filter functionality

### Sales Orders (100 Orders)
- Customer orders in various stages
- Order details and line items
- Status tracking
- Revenue metrics

### Purchasing (60 Purchase Orders)
- Vendor orders
- 20 vendors with contact info
- PO tracking
- Spend analytics

### HR Management (30 Employees)
- Employee directory
- Department distribution
- Payroll information
- Active/leave status

### Invoices (80 Invoices)
- Customer invoices
- Payment tracking
- Overdue alerts
- Financial metrics

### Reports & Analytics
- Monthly trends
- KPI dashboard
- Export functionality
- Business insights

## Features to Try

### ✨ Theme Toggle
- Click the sun/moon icon in the header
- Switch between light and dark modes
- All colors adapt automatically

### 📱 Responsive Design
- Resize your browser
- Try on mobile devices
- Sidebar adapts to screen size

### 🔍 Search & Filter
- Search products by name or SKU
- Filter orders by status
- Find employees by department

### 📊 Interactive Charts
- Hover over charts for details
- View tooltips with data
- Analyze trends

### 🎨 Professional UI
- shadcn/ui components
- Smooth animations
- Consistent design

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Search (when implemented)
- `Esc` - Close dialogs
- `Tab` - Navigate forms

## Tips

1. **Explore All Modules**: Each section has unique features
2. **Check Alerts**: Dashboard shows important notifications
3. **Try Dark Mode**: Fully supported throughout
4. **Test Responsive**: Works on all screen sizes
5. **View Details**: Click on items to see more information

## Need More Data?

Run the seed script again:
```bash
npm run seed
```

This will clear and regenerate all demo data.

## Troubleshooting

### Can't Login?
- Make sure you ran `npm run seed`
- Check MongoDB is running
- Verify credentials: demo@example.com / demo123

### No Data Showing?
- Run `npm run seed` to populate database
- Check MongoDB connection
- Refresh the page

### Styling Issues?
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check console for errors

## Next Steps

1. ✅ Explore all modules
2. ✅ Test CRUD operations
3. ✅ Try different themes
4. ✅ Check responsive design
5. ✅ Review reports
6. ✅ Test workflows

## Documentation

- [Demo Data Guide](./DEMO_DATA_GUIDE.md) - Detailed seeding info
- [Font System](./FONT_SYSTEM.md) - Typography details
- [Theme System](./THEME_AND_RESPONSIVE_UPDATE.md) - Theming guide
- [Dark Mode Fixes](./DARK_MODE_FIXES.md) - Color system

## Support

For issues or questions:
1. Check the documentation
2. Review error messages
3. Check MongoDB logs
4. Verify environment setup

---

**Enjoy exploring your ERP system!** 🎉
