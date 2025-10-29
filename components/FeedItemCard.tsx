import React, { useState } from 'react';
import type { FeedItem, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>;
const CommentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>;
const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path></svg>;
const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>;
const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" clipRule="evenodd" /></svg>;


const FeedItemCard: React.FC<{ item: FeedItem }> = ({ item }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(item.likes);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>(item.comments);
    const [newComment, setNewComment] = useState('');

    const handleLike = () => {
        // The button is disabled if the user is not logged in, so a check here is redundant.
        setLikes(isLiked ? likes - 1 : likes + 1);
        setIsLiked(!isLiked);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && user) {
            const commentToAdd: Comment = {
                id: `C${comments.length + 10}`,
                author: { name: user.name, avatarUrl: user.avatarUrl },
                text: newComment,
            };
            setComments([...comments, commentToAdd]);
            setNewComment('');
        }
    };

    const Tag: React.FC<{ text: string; color: string }> = ({ text, color }) => (
        <span className={`text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full ${color}`}>
            {text}
        </span>
    );

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4">
                <div className="flex items-center">
                    <img className="h-12 w-12 rounded-full object-cover" src={item.author.avatarUrl || 'https://i.pravatar.cc/48'} alt={item.author.name} />
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-900">{item.author.name}</p>
                        <p className="text-xs text-gray-500">{item.timestamp}</p>
                    </div>
                     <div className="ml-auto">
                        {item.type === 'report' ? <Tag text="Signalement" color="bg-red-100 text-red-800" /> : <Tag text="Campagne" color="bg-blue-100 text-blue-800" />}
                    </div>
                </div>
            </div>
            {item.imageUrl && <img className="w-full h-64 object-cover" src={item.imageUrl} alt="Post image" />}
            <div className="p-4">
                {item.title && <h3 className="font-bold text-lg mb-1">{item.title}</h3>}
                <p className="text-gray-700 text-sm">{item.description}</p>
                {item.location && 
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-1"/>
                        <span>{item.location}</span>
                    </div>
                }
            </div>
            <div className="px-4 py-2 border-t border-gray-200 flex justify-between items-center text-gray-500">
                <button onClick={handleLike} disabled={!user} className={`flex items-center space-x-1.5 hover:text-red-500 transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-300 ${isLiked ? 'text-red-500' : ''}`}>
                    <HeartIcon className="h-5 w-5" />
                    <span className="text-sm font-semibold">{likes}</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors duration-200">
                    <CommentIcon className="h-5 w-5" />
                    <span className="text-sm font-semibold">{comments.length}</span>
                </button>
                <button 
                    onClick={() => alert(`Partage du post de ${item.author.name} (simulation).`)}
                    disabled={!user} 
                    className="flex items-center space-x-1.5 hover:text-green-500 transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-300">
                    <ShareIcon className="h-5 w-5" />
                </button>
                 <button
                    onClick={() => alert(`Démarrage d'un chat avec ${item.author.name} (simulation).`)}
                    disabled={!user}
                    className="flex items-center space-x-1.5 hover:text-purple-500 transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-300">
                    <ChatIcon className="h-5 w-5" />
                </button>
            </div>
            {showComments && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-2 mb-3">
                            <img className="h-8 w-8 rounded-full" src={comment.author.avatarUrl || `https://i.pravatar.cc/32?u=${comment.author.name}`} alt={comment.author.name} />
                            <div className="bg-gray-200 rounded-xl p-2 text-sm">
                                <p className="font-semibold text-gray-800">{comment.author.name}</p>
                                <p className="text-gray-700">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                    {user && (
                         <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 mt-4">
                            <img className="h-8 w-8 rounded-full" src={user.avatarUrl || `https://i.pravatar.cc/32?u=${user.name}`} alt={user.name} />
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Écrire un commentaire..."
                                className="w-full bg-gray-200 border-transparent rounded-full py-1.5 px-4 text-sm focus:ring-green-500 focus:border-green-500"
                            />
                             <button type="submit" className="text-green-600 font-semibold text-sm">Publier</button>
                         </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedItemCard;