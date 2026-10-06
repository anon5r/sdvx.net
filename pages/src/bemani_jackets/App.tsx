import { useEffect, useMemo, useState } from 'react';
import { JacketImage } from './JacketImage';
import { ARCADE_LIST, calcImageSize, JACKET_COUNT, listDates } from './jackets';

const FAN_SITE_URL = 'https://p.eagate.573.jp/game/bemani/fansite/p/';
const TWEET_URL = 'https://twitter.com/intent/tweet?text=BEMANI楽曲ジャケット';

interface TwitterWindow extends Window {
  twttr?: { widgets?: { load: () => void } };
}

function useImageSize(): number {
  const [size, setSize] = useState(() => calcImageSize(document.body.clientWidth));
  useEffect(() => {
    const onResize = () => setSize(calcImageSize(document.body.clientWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

export function App() {
  const dates = useMemo(() => listDates(), []);
  const size = useImageSize();
  const [game, setGame] = useState('');
  const [ym, setYm] = useState('');
  const loaded = game !== '' && ym !== '';

  useEffect(() => {
    (window as TwitterWindow).twttr?.widgets?.load();
  }, [loaded]);

  return (
    <>
      <h1>BEMANI Music Jackets</h1>
      <div className="container">
        <div className="controls">
          <label>
            <span className="label-icon" aria-hidden="true">💿</span>
            <select name="game" value={game} onChange={(e) => setGame(e.target.value)}>
              <option value="" disabled>Select Game</option>
              {Object.entries(ARCADE_LIST).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="label-icon" aria-hidden="true">📅</span>
            <select name="month" value={ym} onChange={(e) => setYm(e.target.value)}>
              <option value="" disabled>Select Date</option>
              {dates.map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </label>
        </div>
        <hr />
        {loaded && (
          <div className="segment">
            <ul id="jacket-list">
              {Array.from({ length: JACKET_COUNT }, (_, i) => (
                <li key={`${ym}_${game}_${i}`}>
                  <JacketImage ym={ym} game={game} index={i} size={size} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loaded && (
          <div className="segment" id="img-empty">
            <p>筐体と日付を選択してください。</p>
            <p>
              主に前月以前に追加された楽曲のジャケット画像を一覧できます。ただし月が変わった直後は表示できません。
              <a href={FAN_SITE_URL}>BEMANI Fan Site</a>が更新されると表示されます。
            </p>
            <p>版権曲や外部権利楽曲についてはここに表示されないことが多いです。</p>
            <hr className="dotted" />
            <p>Choose date, and specify title of the game.</p>
            <p>
              You can list of song cover image that was added before last month, but you won&apos;t see that as soon as the next month rolls around.
              You can see it when the <a href={FAN_SITE_URL}>BEMANI Fan Site</a> will updated.
            </p>
            <p>Copyrighted songs, and songs whose rights are not controlled by these video games, often do not appear here.</p>
            <a className="twitter-share-button" href={TWEET_URL} data-size="large">Tweet</a>
          </div>
        )}
      </div>
    </>
  );
}
