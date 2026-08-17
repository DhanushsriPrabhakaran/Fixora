import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Document = {
  id: string;
  title: string;
  fileName: string;
  size: string;
  pages: number;
  date: string;
  category: string;
};

const documents: Document[] = [
  {
    id: '1',
    title: 'Artificial Intelligence',
    fileName: 'AI_Research.pdf',
    size: '2.4 MB',
    pages: 24,
    date: '10 Aug 2026',
    category: 'Research',
  },
  {
    id: '2',
    title: 'Cloud Computing',
    fileName: 'Cloud_Computing.pdf',
    size: '1.8 MB',
    pages: 18,
    date: '08 Aug 2026',
    category: 'Technology',
  },
  {
    id: '3',
    title: 'Computer Networks',
    fileName: 'Computer_Networks.pdf',
    size: '3.1 MB',
    pages: 42,
    date: '05 Aug 2026',
    category: 'Academic',
  },
  {
    id: '4',
    title: 'Machine Learning',
    fileName: 'ML_Notes.pdf',
    size: '1.2 MB',
    pages: 16,
    date: '02 Aug 2026',
    category: 'Study',
  },
];

const Button = ({
  title,
  onPress,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.button, secondary && styles.secondaryButton]}
    onPress={onPress}>
    <Text
      style={[
        styles.buttonText,
        secondary && styles.secondaryButtonText,
      ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const Header = ({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) => (
  <View style={styles.header}>
    {onBack ? (
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.headerSpacer} />
    )}

    <Text style={styles.headerTitle}>{title}</Text>

    <View style={styles.headerSpacer} />
  </View>
);

const InputField = ({
  placeholder,
  secureTextEntry = false,
}: {
  placeholder: string;
  secureTextEntry?: boolean;
}) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#8A8F98"
    secureTextEntry={secureTextEntry}
  />
);

const DocumentCard = ({
  document,
  onPress,
}: {
  document: Document;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.documentCard} onPress={onPress}>
    <View style={styles.pdfIcon}>
      <Text style={styles.pdfIconText}>PDF</Text>
    </View>

    <View style={styles.documentInfo}>
      <Text style={styles.documentTitle} numberOfLines={1}>
        {document.title}
      </Text>

      <Text style={styles.documentDate}>{document.date}</Text>

      <View style={styles.cardBottom}>
        <Text style={styles.documentSize}>{document.size}</Text>

        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{document.category}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [selectedDocument, setSelectedDocument] =
    useState<Document | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const openDocument = (document: Document) => {
    setSelectedDocument(document);
    setScreen('details');
  };

  if (screen === 'splash') {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>D</Text>
        </View>

        <Text style={styles.splashTitle}>DocMind</Text>

        <Text style={styles.splashTagline}>
          Your Intelligent PDF Assistant
        </Text>
      </SafeAreaView>
    );
  }

  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

        <ScrollView contentContainerStyle={styles.authContainer}>
          <View style={styles.authIcon}>
            <Text style={styles.authIconText}>D</Text>
          </View>

          <Text style={styles.authTitle}>Welcome Back</Text>

          <Text style={styles.authSubtitle}>
            Sign in to continue to DocMind
          </Text>

          <InputField placeholder="Email Address" />

          <InputField
            placeholder="Password"
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={() => setScreen('home')}
          />

          <View style={styles.signupRow}>
            <Text style={styles.normalText}>
              Don't have an account?
            </Text>

            <TouchableOpacity onPress={() => setScreen('register')}>
              <Text style={styles.linkText}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'register') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

        <ScrollView contentContainerStyle={styles.authContainer}>
          <View style={styles.authIcon}>
            <Text style={styles.authIconText}>D</Text>
          </View>

          <Text style={styles.authTitle}>Create Account</Text>

          <Text style={styles.authSubtitle}>
            Start organizing your documents
          </Text>

          <InputField placeholder="Full Name" />

          <InputField placeholder="Email Address" />

          <InputField
            placeholder="Password"
            secureTextEntry
          />

          <InputField
            placeholder="Confirm Password"
            secureTextEntry
          />

          <Button
            title="Register"
            onPress={() => setScreen('home')}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => setScreen('login')}>
            <Text style={styles.linkText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.homeHeader}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.userName}>Dhanushsri</Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>D</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            placeholderTextColor="#8A8F98"
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.homeContent}>

          <TouchableOpacity
            style={styles.uploadCard}
            onPress={() => setScreen('upload')}>

            <View style={styles.uploadIcon}>
              <Text style={styles.uploadIconText}>+</Text>
            </View>

            <View>
              <Text style={styles.uploadTitle}>
                Upload New PDF
              </Text>

              <Text style={styles.uploadSubtitle}>
                Analyze and organize your document
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recent Documents
            </Text>

            <Text style={styles.seeAll}>See All</Text>
          </View>

          <FlatList
            data={documents}
            numColumns={2}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({item}) => (
              <DocumentCard
                document={item}
                onPress={() => openDocument(item)}
              />
            )}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'upload') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <Header
          title="Upload PDF"
          onBack={() => setScreen('home')}
        />

        <ScrollView contentContainerStyle={styles.uploadScreen}>
          <TouchableOpacity
            style={styles.filePicker}
            onPress={() =>
              Alert.alert(
                'Select PDF',
                'File selection will be implemented in a later experiment.',
              )
            }>

            <Text style={styles.filePickerIcon}>↑</Text>

            <Text style={styles.filePickerTitle}>
              Select PDF Document
            </Text>

            <Text style={styles.filePickerSubtitle}>
              Tap to select a document from your device
            </Text>
          </TouchableOpacity>

          <Text style={styles.formLabel}>Document Title</Text>
          <InputField placeholder="Enter document title" />

          <Text style={styles.formLabel}>Category</Text>
          <InputField placeholder="e.g. Academic, Research, Study" />

          <Button
            title="Upload Document"
            onPress={() =>
              Alert.alert(
                'Upload',
                'Document upload will be implemented later.',
              )
            }
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'details' && selectedDocument) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <Header
          title="PDF Details"
          onBack={() => setScreen('home')}
        />

        <ScrollView contentContainerStyle={styles.detailsContainer}>
          <View style={styles.largePdfIcon}>
            <Text style={styles.largePdfText}>PDF</Text>
          </View>

          <Text style={styles.detailsTitle}>
            {selectedDocument.title}
          </Text>

          <Text style={styles.fileName}>
            {selectedDocument.fileName}
          </Text>

          <View style={styles.metadataCard}>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>File Size</Text>
              <Text style={styles.metadataValue}>
                {selectedDocument.size}
              </Text>
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Pages</Text>
              <Text style={styles.metadataValue}>
                {selectedDocument.pages}
              </Text>
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Upload Date</Text>
              <Text style={styles.metadataValue}>
                {selectedDocument.date}
              </Text>
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Category</Text>
              <Text style={styles.metadataValue}>
                {selectedDocument.category}
              </Text>
            </View>
          </View>

          <Button
            title="✦  Summarize Document"
            onPress={() => setScreen('summary')}
          />

          <Button
            title="?  Ask a Question"
            secondary
            onPress={() =>
              Alert.alert(
                'Ask Question',
                'Question answering will be implemented in a later experiment.',
              )
            }
          />

          <Button
            title="☆  Bookmark"
            secondary
            onPress={() =>
              Alert.alert(
                'Bookmark',
                'Bookmark functionality will be implemented later.',
              )
            }
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'summary') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <Header
          title="Document Summary"
          onBack={() => setScreen('details')}
        />

        <ScrollView contentContainerStyle={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <View style={styles.smallPdfIcon}>
              <Text style={styles.smallPdfText}>PDF</Text>
            </View>

            <View>
              <Text style={styles.summaryFile}>
                {selectedDocument?.fileName}
              </Text>

              <Text style={styles.summaryGenerated}>
                AI Generated Summary
              </Text>
            </View>
          </View>

          <Text style={styles.summaryHeading}>
            Summary
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              Artificial Intelligence is a field of computer
              science focused on developing systems capable of
              performing tasks that normally require human
              intelligence. These tasks include learning,
              reasoning, problem solving, understanding language,
              and recognizing patterns.
            </Text>

            <Text style={styles.summaryText}>
              Modern AI systems use machine learning and deep
              learning techniques to analyze large amounts of
              data and make predictions or decisions.
            </Text>
          </View>

          <Text style={styles.summaryHeading}>
            Extracted Keywords
          </Text>

          <View style={styles.keywordContainer}>
            {[
              'Artificial Intelligence',
              'Machine Learning',
              'Deep Learning',
              'Neural Networks',
              'Automation',
            ].map(keyword => (
              <View style={styles.keywordTag} key={keyword}>
                <Text style={styles.keywordText}>{keyword}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.summaryHeading}>
            Important Topics
          </Text>

          <View style={styles.topicCard}>
            <Text style={styles.topicItem}>
              • Machine Learning Algorithms
            </Text>

            <Text style={styles.topicItem}>
              • Neural Network Architecture
            </Text>

            <Text style={styles.topicItem}>
              • Natural Language Processing
            </Text>

            <Text style={styles.topicItem}>
              • AI Applications
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  splashContainer: {
    flex: 1,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  logoText: {
    fontSize: 58,
    fontWeight: '800',
    color: '#2563EB',
  },

  splashTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  splashTagline: {
    fontSize: 16,
    color: '#DBEAFE',
    marginTop: 8,
  },

  authContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
  },

  authIcon: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },

  authIconText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
  },

  authTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#172033',
  },

  authSubtitle: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 30,
  },

  input: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#172033',
    marginBottom: 15,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },

  forgotText: {
    color: '#2563EB',
    fontWeight: '600',
  },

  button: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 14,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    backgroundColor: '#EFF6FF',
  },

  secondaryButtonText: {
    color: '#2563EB',
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  normalText: {
    color: '#6B7280',
  },

  linkText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  loginLink: {
    alignItems: 'center',
    marginTop: 12,
  },

  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#172033',
  },

  backButton: {
    width: 40,
  },

  backText: {
    fontSize: 38,
    color: '#172033',
    lineHeight: 40,
  },

  headerSpacer: {
    width: 40,
  },

  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  greeting: {
    color: '#6B7280',
    fontSize: 14,
  },

  userName: {
    color: '#172033',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 3,
  },

  profileCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileText: {
    color: '#2563EB',
    fontSize: 20,
    fontWeight: '800',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
  },

  searchIcon: {
    fontSize: 25,
    color: '#64748B',
  },

  searchInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#172033',
  },

  homeContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
  },

  uploadIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  uploadIconText: {
    fontSize: 30,
    color: '#2563EB',
  },

  uploadTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  uploadSubtitle: {
    color: '#DBEAFE',
    marginTop: 4,
    fontSize: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#172033',
  },

  seeAll: {
    color: '#2563EB',
    fontWeight: '600',
  },

  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  documentCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    elevation: 2,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  pdfIcon: {
    height: 82,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  pdfIconText: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: 20,
  },

  documentInfo: {
    flex: 1,
  },

  documentTitle: {
    fontWeight: '700',
    color: '#172033',
    fontSize: 14,
  },

  documentDate: {
    color: '#8A8F98',
    fontSize: 11,
    marginTop: 5,
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },

  documentSize: {
    fontSize: 11,
    color: '#64748B',
  },

  categoryTag: {
    backgroundColor: '#EFF6FF',
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  categoryText: {
    color: '#2563EB',
    fontSize: 9,
    fontWeight: '700',
  },

  uploadScreen: {
    padding: 22,
  },

  filePicker: {
    height: 210,
    borderWidth: 2,
    borderColor: '#93C5FD',
    borderStyle: 'dashed',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    marginBottom: 28,
  },

  filePickerIcon: {
    fontSize: 40,
    color: '#2563EB',
  },

  filePickerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#172033',
    marginTop: 8,
  },

  filePickerSubtitle: {
    color: '#64748B',
    marginTop: 6,
  },

  formLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 8,
  },

  detailsContainer: {
    padding: 22,
    alignItems: 'center',
  },

  largePdfIcon: {
    width: 130,
    height: 160,
    backgroundColor: '#FEE2E2',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  largePdfText: {
    color: '#DC2626',
    fontSize: 30,
    fontWeight: '900',
  },

  detailsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#172033',
    textAlign: 'center',
  },

  fileName: {
    color: '#64748B',
    marginTop: 6,
    marginBottom: 20,
  },

  metadataCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },

  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  metadataLabel: {
    color: '#64748B',
  },

  metadataValue: {
    color: '#172033',
    fontWeight: '700',
  },

  summaryContainer: {
    padding: 22,
    paddingBottom: 40,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 15,
    marginBottom: 24,
  },

  smallPdfIcon: {
    width: 48,
    height: 58,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  smallPdfText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '900',
  },

  summaryFile: {
    fontWeight: '800',
    color: '#172033',
  },

  summaryGenerated: {
    color: '#2563EB',
    fontSize: 12,
    marginTop: 4,
  },

  summaryHeading: {
    fontSize: 19,
    fontWeight: '800',
    color: '#172033',
    marginBottom: 12,
    marginTop: 8,
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },

  summaryText: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 12,
  },

  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  keywordTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  keywordText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },

  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },

  topicItem: {
    color: '#4B5563',
    fontSize: 14,
    marginBottom: 12,
  },
});