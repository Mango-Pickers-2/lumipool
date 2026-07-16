# Firebase and Cloudinary setup

## Firebase

1. Create a Firebase project and add a Web app.
2. Enable **Authentication > Sign-in method > Email/Password**.
3. Create a Firestore database.
4. Copy `.env.example` to `.env` and fill in all `VITE_FIREBASE_*` values from the Web app config.
5. Publish `firestore.rules` with the Firebase CLI or paste it into **Firestore > Rules**.

The app stores user profiles in `users`, pools in `pools`, purchase orders in `purchase_orders`, and installer work in `dispatch_jobs`.

## Cloudinary proof-of-work images

1. In Cloudinary, create an **unsigned upload preset**.
2. Restrict the preset to image formats, a maximum file size of 10 MB, and the `lumipool/installations` asset folder.
3. Add the cloud name and preset name to `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` in `.env`.

Never put a Cloudinary API secret in a `VITE_*` variable. The browser only uses the restricted unsigned preset. Each completed Firestore job records `proof_image_url`, `proof_public_id`, and `completed_at`.

## Existing Supabase users and data

Firebase cannot use Supabase password hashes directly. Existing accounts need a one-time admin migration (or users must create/reset their Firebase account). Export the three Supabase tables and import them into the matching Firestore collections before switching production traffic. Do not delete the Supabase project until record counts and sample records have been verified.
