import { test, expect } from "@playwright/test";

test("la page de connexion affiche bien le formulaire", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /Connexion/ })).toBeVisible();
  await expect(page.getByLabel("Adresse email")).toBeVisible();
  await expect(page.getByLabel("Mot de passe")).toBeVisible();
});

test("la page d’accueil redirige vers /login lorsqu’il n’y a pas de session", async ({ page }) => {
  await page.goto("/accueil");
  await expect(page).toHaveURL(/\/login$/);
});
