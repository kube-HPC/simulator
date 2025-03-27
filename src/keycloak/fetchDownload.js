import KeycloakServices from 'keycloak/keycloakServices';

export async function fetchDownload(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: KeycloakServices.isLoggedIn
        ? { Authorization: `Bearer ${KeycloakServices.getToken()}` }
        : {},
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = url.split('/').pop() || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Error downloading the file', error);
  }
}
