import { ManifestRequest } from '../gen/messages_pb';
import { getPeerDependencies } from './get_peer_dependencies';
import { testContext } from './testctx';
import { RICH_MANIFEST_JSON, MINIMAL_MANIFEST_JSON, NOT_JSON } from './fixtures';

function mkReq(json: string): ManifestRequest {
  const r = new ManifestRequest();
  r.setManifestJson(json);
  return r;
}

describe('GetPeerDependencies', () => {
  it('extracts peerDependencies with the peerDependenciesMeta.optional flag folded in (hand-verified)', () => {
    const result = getPeerDependencies(testContext, mkReq(RICH_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    const peers = result.getPeersList();
    expect(peers.length).toBe(2);

    const react = peers.find((p) => p.getName() === 'react');
    expect(react?.getRawSpec()).toBe('>=17.0.0');
    // No peerDependenciesMeta entry for "react" -> not optional (npm's default).
    expect(react?.getOptional()).toBe(false);

    const reactDom = peers.find((p) => p.getName() === 'react-dom');
    expect(reactDom?.getRawSpec()).toBe('>=17.0.0');
    // peerDependenciesMeta["react-dom"].optional === true in the fixture.
    expect(reactDom?.getOptional()).toBe(true);
  });

  it('returns an empty list (not an error) when peerDependencies is absent', () => {
    const result = getPeerDependencies(testContext, mkReq(MINIMAL_MANIFEST_JSON));
    expect(result.getError()).toBeUndefined();
    expect(result.getPeersList()).toEqual([]);
  });

  it('reports INVALID_JSON for malformed JSON, not a crash', () => {
    const result = getPeerDependencies(testContext, mkReq(NOT_JSON));
    expect(result.getError()?.getCode()).toBe('INVALID_JSON');
  });
});
