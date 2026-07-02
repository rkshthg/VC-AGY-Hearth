import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';

interface EmotionNode {
  name: string;
  children?: EmotionNode[];
  value?: number;
}

const emotionData: EmotionNode = {
  "name": "Emotions",
  "children": [
    {
      "name": "Happy",
      "children": [
        {
          "name": "Playful",
          "children": [
            { "name": "Aroused" },
            { "name": "Cheeky" }
          ]
        },
        {
          "name": "Content",
          "children": [
            { "name": "Free" },
            { "name": "Joyful" }
          ]
        },
        {
          "name": "Interested",
          "children": [
            { "name": "Curious" },
            { "name": "Inquisitive" }
          ]
        },
        {
          "name": "Proud",
          "children": [
            { "name": "Successful" },
            { "name": "Confident" }
          ]
        },
        {
          "name": "Accepted",
          "children": [
            { "name": "Respected" },
            { "name": "Valued" }
          ]
        },
        {
          "name": "Powerful",
          "children": [
            { "name": "Courageous" },
            { "name": "Creative" }
          ]
        },
        {
          "name": "Peaceful",
          "children": [
            { "name": "Loving" },
            { "name": "Thankful" }
          ]
        },
        {
          "name": "Trusting",
          "children": [
            { "name": "Sensitive" },
            { "name": "Intimate" }
          ]
        },
        {
          "name": "Optimistic",
          "children": [
            { "name": "Hopeful" },
            { "name": "Inspired" }
          ]
        }
      ]
    },
    {
      "name": "Sad",
      "children": [
        {
          "name": "Lonely",
          "children": [
            { "name": "Isolated" },
            { "name": "Abandoned" }
          ]
        },
        {
          "name": "Vulnerable",
          "children": [
            { "name": "Victimized" },
            { "name": "Fragile" }
          ]
        },
        {
          "name": "Despair",
          "children": [
            { "name": "Grief-stricken" },
            { "name": "Powerless" }
          ]
        },
        {
          "name": "Guilty",
          "children": [
            { "name": "Ashamed" },
            { "name": "Remorseful" }
          ]
        },
        {
          "name": "Depressed",
          "children": [
            { "name": "Empty" },
            { "name": "Empty-hearted" }
          ]
        },
        {
          "name": "Hurt",
          "children": [
            { "name": "Embarrassed" },
            { "name": "Disappointed" }
          ]
        }
      ]
    },
    {
      "name": "Bad",
      "children": [
        {
          "name": "Stressed",
          "children": [
            { "name": "Out of Control" },
            { "name": "Overwhelmed" }
          ]
        },
        {
          "name": "Tired",
          "children": [
            { "name": "Sleepy" },
            { "name": "Unfocussed" }
          ]
        },
        {
          "name": "Bored",
          "children": [
            { "name": "Indifferent" },
            { "name": "Apathetic" }
          ]
        },
        {
          "name": "Busy",
          "children": [
            { "name": "Pressured" },
            { "name": "Rushed" }
          ]
        }
      ]
    },
    {
      "name": "Angry",
      "children": [
        {
          "name": "Let down",
          "children": [
            { "name": "Betrayed" },
            { "name": "Resentful" }
          ]
        },
        {
          "name": "Humiliated",
          "children": [
            { "name": "Disrespected" },
            { "name": "Ridiculed" }
          ]
        },
        {
          "name": "Bitter",
          "children": [
            { "name": "Indignant" },
            { "name": "Violated" }
          ]
        },
        {
          "name": "Mad",
          "children": [
            { "name": "Furious" },
            { "name": "Enraged" }
          ]
        },
        {
          "name": "Aggressive",
          "children": [
            { "name": "Provoked" },
            { "name": "Hostile" }
          ]
        },
        {
          "name": "Frustrated",
          "children": [
            { "name": "Infuriated" },
            { "name": "Annoyed" }
          ]
        },
        {
          "name": "Distant",
          "children": [
            { "name": "Withdrawn" },
            { "name": "Numb" }
          ]
        },
        {
          "name": "Critical",
          "children": [
            { "name": "Skeptical" },
            { "name": "Dismissive" }
          ]
        }
      ]
    },
    {
      "name": "Disgusted",
      "children": [
        {
          "name": "Repelled",
          "children": [
            { "name": "Hesitant" },
            { "name": "Revolted" }
          ]
        },
        {
          "name": "Awful",
          "children": [
            { "name": "Nauseated" },
            { "name": "Detestable" }
          ]
        },
        {
          "name": "Disappointed",
          "children": [
            { "name": "Appalled" },
            { "name": "Revolted" }
          ]
        },
        {
          "name": "Awful-feeling",
          "children": [
            { "name": "Detestable-feeling" },
            { "name": "Nauseated-feeling" }
          ]
        }
      ]
    },
    {
      "name": "Fearful",
      "children": [
        {
          "name": "Scared",
          "children": [
            { "name": "Helpless" },
            { "name": "Frightened" }
          ]
        },
        {
          "name": "Anxious",
          "children": [
            { "name": "Overwhelmed" },
            { "name": "Worried" }
          ]
        },
        {
          "name": "Insecure",
          "children": [
            { "name": "Inadequate" },
            { "name": "Inferior" }
          ]
        },
        {
          "name": "Submissive",
          "children": [
            { "name": "Worthless" },
            { "name": "Insignificant" }
          ]
        },
        {
          "name": "Rejected",
          "children": [
            { "name": "Excluded" },
            { "name": "Persecuted" }
          ]
        },
        {
          "name": "Humiliated-fear",
          "children": [
            { "name": "Ridiculed-fear" },
            { "name": "Disrespected-fear" }
          ]
        }
      ]
    },
    {
      "name": "Surprised",
      "children": [
        {
          "name": "Startled",
          "children": [
            { "name": "Shocked" },
            { "name": "Dismayed" }
          ]
        },
        {
          "name": "Confused",
          "children": [
            { "name": "Disillusioned" },
            { "name": "Perplexed" }
          ]
        },
        {
          "name": "Amazed",
          "children": [
            { "name": "Astonished" },
            { "name": "Awe" }
          ]
        },
        {
          "name": "Excited",
          "children": [
            { "name": "Eager" },
            { "name": "Energetic" }
          ]
        }
      ]
    }
  ]
};

interface EmotionWheelProps {
  onEmotionSelect: (path: string[]) => void;
}

const colorMap: Record<string, string> = {
  Happy: "#fde047",
  Sad: "#60a5fa",
  Bad: "#4ade80",
  Angry: "#f87171",
  Disgusted: "#c084fc",
  Fearful: "#fb923c",
  Surprised: "#22d3ee",
};

export const EmotionWheel: React.FC<EmotionWheelProps> = ({ onEmotionSelect }) => {
  const [level, setLevel] = useState<'core' | 'secondary' | 'tertiary'>('core');
  const [selectedCore, setSelectedCore] = useState<string | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null);

  const getCoreColor = (coreName: string | null) => {
    if (!coreName) return 'var(--primary)';
    return colorMap[coreName] || 'var(--primary)';
  };

  const handleCoreClick = (name: string) => {
    setSelectedCore(name);
    setLevel('secondary');
  };

  const handleSecondaryClick = (name: string) => {
    setSelectedSecondary(name);
    setLevel('tertiary');
  };

  const handleTertiaryClick = (name: string) => {
    if (selectedCore && selectedSecondary) {
      onEmotionSelect([selectedCore, selectedSecondary, name]);
    }
  };

  const handleBack = () => {
    if (level === 'tertiary') {
      setSelectedSecondary(null);
      setLevel('secondary');
    } else if (level === 'secondary') {
      setSelectedCore(null);
      setLevel('core');
    }
  };

  const handleReset = () => {
    setSelectedCore(null);
    setSelectedSecondary(null);
    setLevel('core');
  };

  const coreNodes = emotionData.children || [];
  const selectedCoreNode = coreNodes.find(c => c.name === selectedCore);
  const secondaryNodes = selectedCoreNode?.children || [];
  const selectedSecondaryNode = secondaryNodes.find(s => s.name === selectedSecondary);
  const tertiaryNodes = selectedSecondaryNode?.children || [];

  const themeColor = getCoreColor(selectedCore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>How are you feeling?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Select your feelings step-by-step
        </p>
      </div>

      {/* Button Selection Container */}
      <div className="glass-card" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        
        {/* Selected Core Breadcrumb Button */}
        {selectedCore && (
          <button
            onClick={handleReset}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              backgroundColor: `${themeColor}15`,
              border: `1.5px dashed ${themeColor}`,
              color: themeColor,
              fontWeight: 600,
              fontSize: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '0.25rem'
            }}
            title="Click to reset core emotion"
          >
            <span>Core: {selectedCore}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Change</span>
          </button>
        )}

        {/* Selected Secondary Breadcrumb Button */}
        {selectedSecondary && (
          <button
            onClick={handleBack}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              backgroundColor: `${themeColor}08`,
              border: `1.5px dashed ${themeColor}80`,
              color: 'var(--text-color)',
              fontWeight: 500,
              fontSize: '0.95rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '0.5rem'
            }}
            title="Click to change secondary emotion"
          >
            <span>Secondary: {selectedSecondary}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Change</span>
          </button>
        )}

        {/* Divider if we have active selections */}
        {(selectedCore || selectedSecondary) && (
          <div style={{ 
            height: '1px', 
            backgroundColor: 'rgba(255,255,255,0.06)', 
            margin: '0.5rem 0' 
          }} />
        )}

        {/* Level list options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          
          {/* Level 1: Core */}
          {level === 'core' && coreNodes.map(node => {
            const color = colorMap[node.name] || 'var(--primary)';
            return (
              <button
                key={node.name}
                onClick={() => handleCoreClick(node.name)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${color}30`,
                  color: 'var(--text-color)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = `${color}10`;
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = `${color}30`;
                  e.currentTarget.style.transform = 'translateX(0px)';
                }}
              >
                <span>{node.name}</span>
                <ChevronRight size={16} style={{ color: color, opacity: 0.8 }} />
              </button>
            );
          })}

          {/* Level 2: Secondary */}
          {level === 'secondary' && secondaryNodes.map(node => (
            <button
              key={node.name}
              onClick={() => handleSecondaryClick(node.name)}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: `1px solid ${themeColor}30`,
                color: 'var(--text-color)',
                fontWeight: 500,
                fontSize: '1rem',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = `${themeColor}08`;
                e.currentTarget.style.borderColor = themeColor;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = `${themeColor}30`;
                e.currentTarget.style.transform = 'translateX(0px)';
              }}
            >
              <span>{node.name}</span>
              <ChevronRight size={16} style={{ color: themeColor, opacity: 0.8 }} />
            </button>
          ))}

          {/* Level 3: Tertiary */}
          {level === 'tertiary' && tertiaryNodes.map(node => (
            <button
              key={node.name}
              onClick={() => handleTertiaryClick(node.name)}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: `${themeColor}10`,
                border: `1.5px solid ${themeColor}`,
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '1rem',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: `0 4px 10px ${themeColor}15`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = `${themeColor}20`;
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = `0 6px 15px ${themeColor}25`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = `${themeColor}10`;
                e.currentTarget.style.transform = 'translateX(0px)';
                e.currentTarget.style.boxShadow = `0 4px 10px ${themeColor}15`;
              }}
            >
              <span>{node.name}</span>
              <Check size={16} style={{ color: themeColor }} />
            </button>
          ))}

        </div>

      </div>
    </div>
  );
};
