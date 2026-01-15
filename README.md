# Trapotopia
Site pour la guilde Dofus Trapotopia

# Stack
- **Transverse**
  - NVM v1.1.10
  - Node v20.19.4
  - NPM v10.8.2
- **Front / Back**
  - AnalogJS v2.1.3
  - Angular 21
- **BDD**
  - Drizzle ORM
  - PostgreSQL 17

# Installation & Run
```bash
npm i
npm run dev
```

# Drizzle ORM

## Commandes disponibles

```bash
# Générer une migration à partir des changements du schéma
npx drizzle-kit generate

# Appliquer les migrations en attente sur la BDD
npx drizzle-kit migrate

# Pousser les changements directement (sans fichier de migration)
npx drizzle-kit push
```
