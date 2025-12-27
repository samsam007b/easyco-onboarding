# 📦 GUIDE: Créer les produits Stripe

## ✅ Ce qui est déjà fait

- ✅ Compte Stripe créé
- ✅ Clés API configurées dans `.env.local`
- ✅ SDK Stripe installé
- ✅ Clients Stripe (serveur + client) créés
- ✅ Migration DB prête (091_add_stripe_fields.sql)

---

## 🎯 Ce qu'il faut faire maintenant

Tu dois créer **4 produits** dans le Stripe Dashboard pour obtenir les **Price IDs**.

---

## 📝 Étapes détaillées

### 1️⃣ Accéder au Dashboard Stripe Products

Va sur: https://dashboard.stripe.com/test/products

(Tu devrais déjà être connecté)

---

### 2️⃣ Créer le premier produit: EASYCO Owner - Mensuel

1. Clique sur **"+ Add product"** (ou "+ Ajouter un produit")

2. Remplis les informations:

   **Product information:**
   - **Name**: `EASYCO Owner - Mensuel`
   - **Description**: `Accès complet pour propriétaires - Facturation mensuelle`
   - **Image**: (Optionnel - tu peux skip pour l'instant)

   **Pricing:**
   - **Pricing model**: `Standard pricing`
   - **Price**: `29.99`
   - **Currency**: `EUR` (€)
   - **Billing period**: `Monthly` (Mensuel)

   **Additional options:**
   - Cocher ✅ **"Recurring"** (c'est déjà coché par défaut si tu as choisi Monthly)

3. Clique sur **"Add product"** (ou "Ajouter le produit")

4. **IMPORTANT**: Une fois créé, tu verras la page du produit avec un **Price ID**
   - Format: `price_xxxxxxxxxxxxx`
   - **Copie ce Price ID** quelque part (tu en auras besoin!)

---

### 3️⃣ Créer le deuxième produit: EASYCO Owner - Annuel

Répète la même opération:

1. Clique sur **"+ Add product"**

2. Remplis:
   - **Name**: `EASYCO Owner - Annuel`
   - **Description**: `Accès complet pour propriétaires - Facturation annuelle (économie de €60)`
   - **Price**: `299`
   - **Currency**: `EUR` (€)
   - **Billing period**: `Yearly` (Annuel)

3. Clique sur **"Add product"**

4. **Copie le Price ID** de ce produit aussi

---

### 4️⃣ Créer le troisième produit: EASYCO Resident - Mensuel

1. Clique sur **"+ Add product"**

2. Remplis:
   - **Name**: `EASYCO Resident - Mensuel`
   - **Description**: `Accès complet pour résidents - Facturation mensuelle`
   - **Price**: `19.99`
   - **Currency**: `EUR` (€)
   - **Billing period**: `Monthly`

3. Clique sur **"Add product"**

4. **Copie le Price ID**

---

### 5️⃣ Créer le quatrième produit: EASYCO Resident - Annuel

1. Clique sur **"+ Add product"**

2. Remplis:
   - **Name**: `EASYCO Resident - Annuel`
   - **Description**: `Accès complet pour résidents - Facturation annuelle (économie de €40)`
   - **Price**: `199`
   - **Currency**: `EUR` (€)
   - **Billing period**: `Yearly`

3. Clique sur **"Add product"**

4. **Copie le Price ID**

---

## ✅ Résumé: Tu devrais avoir 4 Price IDs

À la fin, tu auras quelque chose comme:

```
STRIPE_PRICE_OWNER_MONTHLY=price_1234567890abcdef
STRIPE_PRICE_OWNER_ANNUAL=price_0987654321fedcba
STRIPE_PRICE_RESIDENT_MONTHLY=price_abcdef1234567890
STRIPE_PRICE_RESIDENT_ANNUAL=price_fedcba0987654321
```

---

## 📋 Prochaine étape

**Envoie-moi les 4 Price IDs** et je vais:
1. Mettre à jour le fichier `.env.local`
2. Créer la première API route Stripe (Checkout Session)
3. Modifier le SubscriptionBanner pour ajouter le bouton "Upgrade"

Format attendu:
```
OWNER_MONTHLY: price_xxx
OWNER_ANNUAL: price_xxx
RESIDENT_MONTHLY: price_xxx
RESIDENT_ANNUAL: price_xxx
```

Tu peux juste me coller les 4 IDs et je m'occupe du reste! 🚀

---

## 💡 Tips

- Les produits en mode **Test** ne facturent pas de vrais paiements
- Tu pourras créer les mêmes produits en mode **Live** plus tard
- Les Price IDs sont permanents, ils ne changent pas
- Si tu fais une erreur, tu peux toujours modifier le produit après
