import React, { useState, useEffect, useRef } from 'react';
import { useProgress } from '../context/ProgressContext';
import { locationStaticData } from '../data/locations';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';

export const MapPage = ({ locationName, onBack, onQuestClick }) => {
  const { 
    questsData, 
    userProgress, 
    setUserProgress,
    mapRaidCompletedQuestIds,
    setMapRaidCompletedQuestIds 
  } = useProgress();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [layerPmc, setLayerPmc] = useState(true);
  const [layerScav, setLayerScav] = useState(true);
  const [layerBoss, setLayerBoss] = useState(true);
  const [activeExtracts, setActiveExtracts] = useState([]);

  const locData = locationStaticData[locationName];

  const activeQuests = questsData.filter(q => userProgress.takenQuestIds.includes(q.id));
  const specificQuests = activeQuests.filter(q => {
    const locs = Array.isArray(q.location) ? q.location : [q.location];
    return locs.includes(locationName);
  });
  const anyQuests = activeQuests.filter(q => {
    const locs = Array.isArray(q.location) ? q.location : [q.location];
    return locs.includes('Любая');
  });

  useEffect(() => {
    if (locData?.extracts) {
      setActiveExtracts(locData.extracts.map(e => e.id));
    }
    setMapRaidCompletedQuestIds([]);
  }, [locationName, locData, setMapRaidCompletedQuestIds]);

  // Эффект инициализации холста Leaflet
  useEffect(() => {
    if (!locData || !mapContainerRef.current) return;

    // Хак для предотвращения конфликта React StrictMode и Leaflet ID
    const existingContainer = L.DomUtil.get(mapContainerRef.current);
    if (existingContainer && existingContainer._leaflet_id) {
      existingContainer._leaflet_id = null;
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Создаем экземпляр
    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -1,
      maxZoom: 2,
      zoomControl: true,
      attributionControl: false
    });

    const bounds = [[0, 0], [locData.height, locData.width]];
    L.imageOverlay(locData.imageUrl, bounds).addTo(map);
    map.fitBounds(bounds);

    const markersGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersGroupRef.current = markersGroup;

    // Триггерим инвалидацию размеров, чтобы карта не отрисовывалась серым куском
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locationName, locData]);
  // Эффект динамической перерисовки маркеров при кликах на слои
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !locData) return;

    markersGroupRef.current.clearLayers();

    // 1. Выходы (Exit)
    if (locData.extracts) {
      locData.extracts.forEach(ext => {
        if (activeExtracts.includes(ext.id)) {
          const icon = L.divIcon({ 
            className: 'custom-map-marker marker-extract', 
            html: 'Exit', 
            iconSize: [32, 32]
          });
          L.marker(ext.coords, { icon }).bindPopup(`<b>Выход:</b> ${ext.name}`).addTo(markersGroupRef.current);
        }
      });
    }

    // 2. Спавны ЧВК (PMC)
    if (layerPmc && locData.spawns?.pmc) {
      locData.spawns.pmc.forEach(coords => {
        const icon = L.divIcon({ 
          className: 'custom-map-marker marker-pmc', 
          html: 'PMC', 
          iconSize: [26, 26]
        });
        L.marker(coords, { icon }).bindPopup('<b>Спавн ЧВК</b>').addTo(markersGroupRef.current);
      });
    }

    // 3. Спавны Диких (Scav)
    if (layerScav && locData.spawns?.scav) {
      locData.spawns.scav.forEach(coords => {
        const icon = L.divIcon({ 
          className: 'custom-map-marker marker-scav', 
          html: 'Scav', 
          iconSize: [26, 26]
        });
        L.marker(coords, { icon }).bindPopup('<b>Спавн Диких</b>').addTo(markersGroupRef.current);
      });
    }

    // 4. Спавны Боссов (Boss)
    if (layerBoss && locData.spawns?.boss) {
      locData.spawns.boss.forEach(coords => {
        const icon = L.divIcon({ 
          className: 'custom-map-marker marker-boss', 
          html: 'Boss', 
          iconSize: [26, 26]
        });
        L.marker(coords, { icon }).bindPopup('<b>Спавн Босса</b>').addTo(markersGroupRef.current);
      });
    }

    // 5. Квесты и Подзадачи (Q)
    const currentActiveQuests = questsData.filter(q => 
      userProgress.takenQuestIds.includes(q.id) && !mapRaidCompletedQuestIds.includes(q.id)
    );

    currentActiveQuests.forEach(quest => {
      const locs = Array.isArray(quest.location) ? quest.location : [quest.location];
      if (locs.includes(locationName) || locs.includes('Любая')) {
        if (quest.subtasks) {
          quest.subtasks.forEach(st => {
            const isDone = userProgress.completedSubtasks.includes(st.id);
            if (!isDone && st.coords) {
              const icon = L.divIcon({ 
                className: 'custom-map-marker marker-quest', 
                html: 'Q', 
                iconSize: [30, 30]
              });
              L.marker(st.coords, { icon })
                .bindPopup(`<b>${quest.title}</b><br>${st.text}`)
                .addTo(markersGroupRef.current);
            }
          });
        }
      }
    });
  }, [locationName, locData, layerPmc, layerScav, layerBoss, activeExtracts, mapRaidCompletedQuestIds, userProgress, questsData]);

  const handleQuestCheck = (qId, checked) => {
    if (checked) {
      setMapRaidCompletedQuestIds(prev => [...prev, qId]);
    } else {
      setMapRaidCompletedQuestIds(prev => prev.filter(id => id !== qId));
    }
  };

  const handleSubtaskCheck = (stId, checked) => {
    setUserProgress(prev => {
      const nextSubtasks = checked 
        ? [...prev.completedSubtasks, stId] 
        : prev.completedSubtasks.filter(id => id !== stId);
      return { ...prev, completedSubtasks: nextSubtasks };
    });
  };

  const toggleExtract = (id) => {
    setActiveExtracts(prev => prev.includes(id) ? prev.filter(eId => eId !== id) : [...prev, id]);
  };
  const renderQuestCard = (quest) => {
    const isRaidDone = mapRaidCompletedQuestIds.includes(quest.id);
    return (
      <div 
        key={quest.id} 
        className={`quest-row ${isRaidDone ? 'quest-completed-strikethrough' : ''}`} 
        style={{ flexDirection: 'column', alignItems: 'stretch', padding: '12px', marginBottom: '8px' }}
      >
        <div className="quest-info-block">
          <input 
            type="checkbox" 
            className="subtask-checkbox"
            checked={isRaidDone} 
            onChange={(e) => handleQuestCheck(quest.id, e.target.checked)} 
          />
          <span className="trader-badge-tag">{quest.trader}</span>
          <span className="quest-title-text" style={{ cursor: 'pointer' }} onClick={() => onQuestClick(quest.id)}>
            {quest.title}
          </span>
        </div>
        {quest.subtasks && (
          <div className="subtask-list" style={{ marginTop: '10px' }}>
            {quest.subtasks.map(st => {
              const isDone = userProgress.completedSubtasks.includes(st.id);
              return (
                <div key={st.id} className={`subtask-item ${isDone ? 'completed' : ''}`}>
                  <input 
                    type="checkbox" 
                    className="subtask-checkbox"
                    checked={isDone} 
                    onChange={(e) => handleSubtaskCheck(st.id, e.target.checked)} 
                  />
                  <span>{st.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="map-page-layout">
      <div className="map-sidebar">
        <button className="btn-back" onClick={onBack}>&larr; К взятым квестам</button>
        
        <h2 className="map-title-centered" style={{ margin: '15px 0 10px 0', textAlign: 'left' }}>
          {locationName}
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ color: '#888', marginBottom: '6px', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Слои карты:
          </h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.9rem', color: '#aaa' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input type="checkbox" checked={layerPmc} onChange={(e) => setLayerPmc(e.target.checked)} />
              ЧВК
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input type="checkbox" checked={layerScav} onChange={(e) => setLayerScav(e.target.checked)} />
              Дикие
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input type="checkbox" checked={layerBoss} onChange={(e) => setLayerBoss(e.target.checked)} />
              Боссы
            </label>
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <h4 style={{ color: '#888', marginBottom: '12px', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Задачи в рейде:
          </h4>
          
          {specificQuests.map(quest => renderQuestCard(quest))}

          {anyQuests.length > 0 && (
            <>
              {specificQuests.length > 0 && (
                <>
                  <hr className="location-divider" />
                  <div className="location-divider-label">Любая локация</div>
                </>
              )}
              {anyQuests.map(quest => renderQuestCard(quest))}
            </>
          )}

          {specificQuests.length === 0 && anyQuests.length === 0 && (
            <div style={{ color: '#666', fontSize: '0.85rem' }}>Нет задач на этой локации</div>
          )}
        </div>
      </div>

      <div className="map-main-area">
        <div className="extracts-bar">
          <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Выходы:</span>
          <div className="extracts-chips">
            {locData?.extracts?.map(ext => (
              <div 
                key={ext.id} 
                className={`extract-chip ${activeExtracts.includes(ext.id) ? 'active' : ''}`}
                onClick={() => toggleExtract(ext.id)}
              >
                {ext.name}
              </div>
            ))}
          </div>
        </div>

        <div 
          ref={mapContainerRef} 
          id="leaflet-map-container" 
          style={{ width: '100%', height: 'calc(100vh - 160px)', minHeight: '500px', background: '#0d0d0d' }} 
        />
      </div>
    </div>
  );
};
