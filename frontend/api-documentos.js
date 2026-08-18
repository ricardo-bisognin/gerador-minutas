const BUCKET = 'documentos-solicitacoes';

export async function uploadDocumentos(solicitacaoId, file) {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    throw new Error('Supabase não configurado neste ambiente.');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._ -]/g, '_');
  const path = `${solicitacaoId}/${crypto.randomUUID()}-${safeName}`;
  const uploadResponse = await fetch(
    `${window.SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(path).replace(/%2F/g, '/')}`,
    {
      method: 'POST',
      headers: {
        apikey: window.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'false'
      },
      body: file
    }
  );

  if (!uploadResponse.ok) {
    const detail = await uploadResponse.text();
    throw new Error(`Falha no upload de ${file.name}: ${detail}`);
  }

  const dbResponse = await fetch(`${window.SUPABASE_URL}/rest/v1/solicitacao_documentos`, {
    method: 'POST',
    headers: {
      apikey: window.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      solicitacao_id: solicitacaoId,
      nome_original: file.name,
      caminho_storage: path,
      tipo_mime: file.type || null,
      tamanho_bytes: file.size
    })
  });

  if (!dbResponse.ok) {
    throw new Error(`Arquivo enviado, mas não foi possível registrar ${file.name} no banco.`);
  }

  return { path, name: file.name };
}
