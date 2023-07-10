

import * as admin from "firebase-admin";

import serviceAccount from "../keys/test-1-service-account.json";
import { getAuth } from "firebase-admin/auth";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: serviceAccount.project_id,
});


getAuth()
    .getUser('fYnE5eWCgqWZBgSEkwwVKqUOZCF2')
    .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log(`Successfully fetched user data: `, userRecord.toJSON());
    })
    .catch((error) => {
        console.log('Error fetching user data:', error);
    });
