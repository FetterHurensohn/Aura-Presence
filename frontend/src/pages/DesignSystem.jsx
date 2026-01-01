import React, { useState } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Stack,
  HStack,
  VStack,
  Button,
  Input,
  Select,
  Checkbox,
  Switch,
  Card,
  Badge,
  Avatar,
  Divider,
  Alert,
  Progress,
  Skeleton,
  EmptyState,
  Tabs,
  Tab,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  Tooltip,
  Spinner,
  Icon,
} from '../design-system/components';
import tokens from '../design-system/tokens.json';

/**
 * Design System Playground
 * 
 * Interactive showcase of all design system components.
 * For development and documentation purposes.
 */
const DesignSystem = () => {
  const [inputValue, setInputValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [progressValue, setProgressValue] = useState(65);

  return (
    <div className="min-h-screen bg-bg-900 py-12">
      <Container maxWidth="2xl">
        <Stack spacing={12}>
          {/* Header */}
          <div className="text-center">
            <h1 className="text-h1 text-white mb-4">Design System Playground</h1>
            <p className="text-body text-muted-500">
              Interactive showcase aller Components und Design Tokens
            </p>
          </div>

          <Divider />

          {/* Tabs Navigation */}
          <Tabs defaultActive="tokens" variant="pills">
            {/* Design Tokens Tab */}
            <Tab id="tokens" label="Design Tokens" icon="info">
              <Stack spacing={8}>
                {/* Colors */}
                <Card>
                  <h2 className="text-h2 text-white mb-4">Farben</h2>
                  <Grid cols={4} gap={4}>
                    {/* Background */}
                    <div>
                      <h3 className="text-h3 text-white mb-2">Background</h3>
                      <Stack spacing={2}>
                        <div className="bg-bg-900 p-4 rounded border border-white/10">
                          <span className="text-small text-white">bg-900</span>
                        </div>
                        <div className="bg-bg-800 p-4 rounded border border-white/10">
                          <span className="text-small text-white">bg-800</span>
                        </div>
                        <div className="bg-bg-700 p-4 rounded border border-white/10">
                          <span className="text-small text-white">bg-700</span>
                        </div>
                      </Stack>
                    </div>

                    {/* Accent */}
                    <div>
                      <h3 className="text-h3 text-white mb-2">Accent</h3>
                      <Stack spacing={2}>
                        <div className="bg-accent-300 p-4 rounded">
                          <span className="text-small text-white">accent-300</span>
                        </div>
                        <div className="bg-accent-400 p-4 rounded">
                          <span className="text-small text-white">accent-400</span>
                        </div>
                        <div className="bg-accent-500 p-4 rounded">
                          <span className="text-small text-white">accent-500</span>
                        </div>
                      </Stack>
                    </div>

                    {/* Semantic */}
                    <div>
                      <h3 className="text-h3 text-white mb-2">Semantic</h3>
                      <Stack spacing={2}>
                        <div className="bg-success p-4 rounded">
                          <span className="text-small text-white">success</span>
                        </div>
                        <div className="bg-danger p-4 rounded">
                          <span className="text-small text-white">danger</span>
                        </div>
                        <div className="bg-cyan p-4 rounded">
                          <span className="text-small text-white">cyan</span>
                        </div>
                      </Stack>
                    </div>

                    {/* Neutral */}
                    <div>
                      <h3 className="text-h3 text-white mb-2">Neutral</h3>
                      <Stack spacing={2}>
                        <div className="bg-surface-800 p-4 rounded border border-white/10">
                          <span className="text-small text-white">surface-800</span>
                        </div>
                        <div className="bg-muted-500 p-4 rounded">
                          <span className="text-small text-white">muted-500</span>
                        </div>
                      </Stack>
                    </div>
                  </Grid>
                </Card>

                {/* Typography */}
                <Card>
                  <h2 className="text-h2 text-white mb-4">Typography</h2>
                  <Stack spacing={4}>
                    <div>
                      <span className="text-h1 text-white">Heading 1 (36px)</span>
                      <p className="text-small text-muted-500">text-h1</p>
                    </div>
                    <div>
                      <span className="text-h2 text-white">Heading 2 (28px)</span>
                      <p className="text-small text-muted-500">text-h2</p>
                    </div>
                    <div>
                      <span className="text-h3 text-white">Heading 3 (20px)</span>
                      <p className="text-small text-muted-500">text-h3</p>
                    </div>
                    <div>
                      <span className="text-body text-white">Body Text (16px)</span>
                      <p className="text-small text-muted-500">text-body</p>
                    </div>
                    <div>
                      <span className="text-small text-white">Small Text (12px)</span>
                      <p className="text-small text-muted-500">text-small</p>
                    </div>
                    <div>
                      <span className="text-caption text-white">CAPTION (10px)</span>
                      <p className="text-small text-muted-500">text-caption</p>
                    </div>
                  </Stack>
                </Card>

                {/* Spacing */}
                <Card>
                  <h2 className="text-h2 text-white mb-4">Spacing</h2>
                  <Stack spacing={4}>
                    {[1, 2, 3, 4, 6, 8, 12].map(size => (
                      <HStack key={size} spacing={4} align="center">
                        <div 
                          className="bg-accent-500 h-8"
                          style={{ width: `${size * 4}px` }}
                        />
                        <span className="text-body text-white">
                          {size} = {size * 4}px
                        </span>
                      </HStack>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </Tab>

            {/* Layout Tab */}
            <Tab id="layout" label="Layout" icon="home">
              <Stack spacing={8}>
                <Card>
                  <h2 className="text-h2 text-white mb-4">Container</h2>
                  <div className="bg-accent-500/20 border border-accent-500 rounded">
                    <Container maxWidth="md">
                      <p className="text-body text-white py-4 text-center">
                        Container (max-width: md)
                      </p>
                    </Container>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Grid</h2>
                  <Grid cols={3} gap={4}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="bg-accent-500 p-4 rounded text-center">
                        <span className="text-white">Item {i}</span>
                      </div>
                    ))}
                  </Grid>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Stack</h2>
                  <Grid cols={2} gap={6}>
                    <div>
                      <h3 className="text-h3 text-white mb-3">VStack</h3>
                      <VStack spacing={3}>
                        <div className="bg-accent-500 p-3 rounded w-full text-center text-white">Item 1</div>
                        <div className="bg-accent-500 p-3 rounded w-full text-center text-white">Item 2</div>
                        <div className="bg-accent-500 p-3 rounded w-full text-center text-white">Item 3</div>
                      </VStack>
                    </div>
                    <div>
                      <h3 className="text-h3 text-white mb-3">HStack</h3>
                      <HStack spacing={3}>
                        <div className="bg-accent-500 p-3 rounded flex-1 text-center text-white">Item 1</div>
                        <div className="bg-accent-500 p-3 rounded flex-1 text-center text-white">Item 2</div>
                        <div className="bg-accent-500 p-3 rounded flex-1 text-center text-white">Item 3</div>
                      </HStack>
                    </div>
                  </Grid>
                </Card>
              </Stack>
            </Tab>

            {/* Forms Tab */}
            <Tab id="forms" label="Forms" icon="edit">
              <Stack spacing={8}>
                <Card>
                  <h2 className="text-h2 text-white mb-4">Buttons</h2>
                  <Grid cols={2} gap={6}>
                    <Stack spacing={3}>
                      <Button variant="primary">Primary Button</Button>
                      <Button variant="secondary">Secondary Button</Button>
                      <Button variant="ghost">Ghost Button</Button>
                      <Button variant="danger">Danger Button</Button>
                    </Stack>
                    <Stack spacing={3}>
                      <Button variant="primary" icon="check">With Icon</Button>
                      <Button variant="primary" loading>Loading</Button>
                      <Button variant="primary" disabled>Disabled</Button>
                      <Button variant="primary" size="sm">Small</Button>
                    </Stack>
                  </Grid>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Inputs</h2>
                  <Stack spacing={4}>
                    <Input 
                      label="Text Input" 
                      placeholder="Enter text..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Input 
                      label="With Icon" 
                      icon="search"
                      placeholder="Search..."
                    />
                    <Input 
                      label="With Error" 
                      error="This field is required"
                    />
                    <Input 
                      label="Disabled" 
                      disabled
                      value="Disabled input"
                    />
                  </Stack>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Checkbox & Switch</h2>
                  <Grid cols={2} gap={6}>
                    <Stack spacing={4}>
                      <Checkbox 
                        label="Checkbox Option 1"
                        checked={checkboxChecked}
                        onChange={() => setCheckboxChecked(!checkboxChecked)}
                      />
                      <Checkbox label="Checkbox Option 2" />
                      <Checkbox label="Disabled" disabled />
                    </Stack>
                    <Stack spacing={4}>
                      <Switch 
                        label="Enable Feature"
                        checked={switchOn}
                        onChange={() => setSwitchOn(!switchOn)}
                      />
                      <Switch label="Another Option" />
                      <Switch label="Disabled" disabled />
                    </Stack>
                  </Grid>
                </Card>
              </Stack>
            </Tab>

            {/* Feedback Tab */}
            <Tab id="feedback" label="Feedback" icon="info">
              <Stack spacing={8}>
                <Card>
                  <h2 className="text-h2 text-white mb-4">Alerts</h2>
                  <Stack spacing={4}>
                    <Alert variant="info" title="Info Alert">
                      This is an informational message.
                    </Alert>
                    <Alert variant="success" title="Success">
                      Your changes have been saved successfully.
                    </Alert>
                    <Alert variant="warning" title="Warning">
                      Your session will expire soon.
                    </Alert>
                    <Alert variant="danger" title="Error" dismissible>
                      An error occurred. Please try again.
                    </Alert>
                  </Stack>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Progress</h2>
                  <Stack spacing={6}>
                    <div>
                      <HStack justify="between" className="mb-2">
                        <span className="text-small text-white">Progress: {progressValue}%</span>
                        <HStack spacing={2}>
                          <Button size="sm" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>-</Button>
                          <Button size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>+</Button>
                        </HStack>
                      </HStack>
                      <Progress value={progressValue} showLabel />
                    </div>
                    <Progress value={45} variant="success" />
                    <Progress value={80} variant="danger" />
                    <Progress indeterminate />
                  </Stack>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Skeleton</h2>
                  <Stack spacing={4}>
                    <Skeleton type="text" lines={3} />
                    <HStack spacing={3}>
                      <Skeleton type="avatar" size="lg" circle />
                      <VStack spacing={2} className="flex-1">
                        <Skeleton type="text" />
                        <Skeleton type="text" width="60%" />
                      </VStack>
                    </HStack>
                    <Skeleton type="card" height="200px" />
                  </Stack>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Empty State</h2>
                  <EmptyState 
                    icon="chart"
                    title="Keine Daten verfügbar"
                    description="Erstelle deine erste Analyse um Ergebnisse zu sehen."
                    action={<Button>Jetzt starten</Button>}
                  />
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Spinner</h2>
                  <Grid cols={3} gap={6}>
                    <VStack align="center" spacing={2}>
                      <Spinner size="md" variant="accent" style="circle" />
                      <span className="text-small text-muted-500">Circle</span>
                    </VStack>
                    <VStack align="center" spacing={2}>
                      <Spinner size="md" variant="accent" style="dots" />
                      <span className="text-small text-muted-500">Dots</span>
                    </VStack>
                    <VStack align="center" spacing={2}>
                      <Spinner size="md" variant="accent" style="bars" />
                      <span className="text-small text-muted-500">Bars</span>
                    </VStack>
                  </Grid>
                </Card>
              </Stack>
            </Tab>

            {/* Data Display Tab */}
            <Tab id="data" label="Data Display" icon="card">
              <Stack spacing={8}>
                <div>
                  <h2 className="text-h2 text-white mb-4">Cards</h2>
                  <Grid cols={3} gap={4}>
                    <Card>
                      <h3 className="text-h3 text-white mb-2">Card Title</h3>
                      <p className="text-body text-muted-500">
                        Card content goes here. This is a basic card component.
                      </p>
                    </Card>
                    <Card>
                      <h3 className="text-h3 text-white mb-2">Another Card</h3>
                      <p className="text-body text-muted-500">
                        Cards are versatile and can contain any content.
                      </p>
                    </Card>
                    <Card>
                      <h3 className="text-h3 text-white mb-2">Third Card</h3>
                      <p className="text-body text-muted-500">
                        Perfect for grid layouts and dashboards.
                      </p>
                    </Card>
                  </Grid>
                </div>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Badges</h2>
                  <HStack spacing={3} wrap>
                    <Badge variant="accent">Accent</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="neutral">Neutral</Badge>
                    <Badge variant="accent" size="sm">Small</Badge>
                    <Badge variant="accent" size="lg">Large</Badge>
                    <Badge variant="success" pulse>New</Badge>
                    <Badge variant="accent" dot />
                  </HStack>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Avatars</h2>
                  <HStack spacing={4} align="center">
                    <Avatar size="xs" fallback="initials" initials="XS" />
                    <Avatar size="sm" fallback="initials" initials="SM" />
                    <Avatar size="md" fallback="initials" initials="MD" status="online" />
                    <Avatar size="lg" fallback="initials" initials="LG" status="away" />
                    <Avatar size="xl" fallback="initials" initials="XL" status="busy" />
                  </HStack>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Dividers</h2>
                  <Stack spacing={4}>
                    <Divider />
                    <Divider text="oder" />
                    <Divider icon="star" />
                    <HStack spacing={4} className="h-24">
                      <div className="flex-1">Links</div>
                      <Divider orientation="vertical" />
                      <div className="flex-1">Rechts</div>
                    </HStack>
                  </Stack>
                </Card>
              </Stack>
            </Tab>

            {/* Interactive Tab */}
            <Tab id="interactive" label="Interactive" icon="settings">
              <Stack spacing={8}>
                <Card>
                  <h2 className="text-h2 text-white mb-4">Tooltips</h2>
                  <HStack spacing={4}>
                    <Tooltip content="Tooltip oben" placement="top">
                      <Button>Hover me (Top)</Button>
                    </Tooltip>
                    <Tooltip content="Tooltip unten" placement="bottom">
                      <Button>Hover me (Bottom)</Button>
                    </Tooltip>
                    <Tooltip content="Tooltip links" placement="left">
                      <Button>Hover me (Left)</Button>
                    </Tooltip>
                    <Tooltip content="Tooltip rechts" placement="right">
                      <Button>Hover me (Right)</Button>
                    </Tooltip>
                  </HStack>
                </Card>

                <Card>
                  <h2 className="text-h2 text-white mb-4">Dropdown</h2>
                  <Dropdown trigger={<Button>Open Menu</Button>}>
                    <DropdownItem icon="edit">Bearbeiten</DropdownItem>
                    <DropdownItem icon="download">Herunterladen</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem icon="trash" danger>Löschen</DropdownItem>
                  </Dropdown>
                </Card>
              </Stack>
            </Tab>

            {/* Icons Tab */}
            <Tab id="icons" label="Icons" icon="star">
              <Card>
                <h2 className="text-h2 text-white mb-4">Available Icons</h2>
                <Grid cols={6} gap={4}>
                  {[
                    'home', 'chart', 'settings', 'user', 'bell', 'camera',
                    'video', 'mic', 'play', 'pause', 'stop', 'record',
                    'upload', 'download', 'edit', 'trash', 'check', 'close',
                    'info', 'warning', 'error', 'lock', 'unlock', 'shield',
                    'clock', 'chevron-left', 'chevron-right', 'chevron-down', 'menu', 'logout'
                  ].map(iconName => (
                    <VStack key={iconName} align="center" spacing={2} className="p-3 bg-surface-800 rounded hover:bg-surface-700 transition-colors duration-base">
                      <Icon name={iconName} className="w-6 h-6 text-accent-500" />
                      <span className="text-caption text-muted-500">{iconName}</span>
                    </VStack>
                  ))}
                </Grid>
              </Card>
            </Tab>
          </Tabs>
        </Stack>
      </Container>
    </div>
  );
};

export default DesignSystem;



